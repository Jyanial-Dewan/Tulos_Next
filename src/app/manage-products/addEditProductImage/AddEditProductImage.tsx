"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IProduct } from "@/store/slices/productSlice";
import { useEffect, useRef, useState } from "react";
import ImageCropModal from "./ImageCropModal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { endpoints } from "@/variables/variables";
import { deleteData, loadData } from "@/utility/httpRequest";
import { toast } from "sonner";
import { convertToTitleCase } from "@/utility/general";

const MAX_IMAGES = 3;
const MAX_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type QueuedImage =
  | {
      type: "existing";
      id: string; // use image_id as string
      imageId: number; // real DB id, needed for delete calls
      previewUrl: string; // the server-side URL, e.g. /uploads/products/xxx.jpg
    }
  | {
      type: "new";
      id: string; // client-generated uuid
      file: File; // cropped, ready-to-upload file
      previewUrl: string; // blob: URL
    };

interface Props {
  product: IProduct | undefined;
}

const AddEditProductImage = ({ product }: Props) => {
  const [queue, setQueue] = useState<QueuedImage[]>([]);
  const [pendingCrop, setPendingCrop] = useState<{
    src: string;
    name: string;
    type: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product?.product_id) {
      const fetchProductImages = async () => {
        const params = {
          url: `${endpoints.ProductImages}?product_id=${product.product_id}`,
          setLoading: setLoading,
        };

        const res = await loadData(params);
        console.log(res, "images");
        if (res?.status === 200) {
          setQueue(
            res.data.result.map((img: any) => ({
              type: "existing",
              id: `existing-${img.image_id}`,
              imageId: img.image_id,
              previewUrl: img.image_url, // this is a real path like /uploads/products/xxx.jpg — works directly in <img>/<Image>
            })),
          );
        }
      };
      fetchProductImages();
    }
  }, [product?.product_id]);

  const remainingSlots = MAX_IMAGES - queue.length;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Reuse the same validation/queue logic as the file input.
    // Wrap into a fake event-like object, or just factor the body of
    // handleFilesSelected into a separate function that takes File[].
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    setError(null);

    if (files.length > remainingSlots) {
      setError(
        `You can only add ${remainingSlots} more image(s) (max ${MAX_IMAGES} total for this product).`,
      );
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(
          `"${file.name}" is not a valid type. Only JPEG, PNG, and WEBP are allowed.`,
        );
        return;
      }
      if (file.size > MAX_SIZE * 10) {
        setError(`"${file.name}" is too large to process.`);
        return;
      }
    }

    processNextFile(files, 0);
  };

  // Your existing input handler now just extracts files and delegates:
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (files.length === 0) return;
    handleFiles(files);
  };

  const processNextFile = (files: File[], index: number) => {
    if (index >= files.length) return;
    const file = files[index];
    const src = URL.createObjectURL(file);
    setPendingCrop({ src, name: file.name, type: file.type });

    // stash remaining files/index on a ref-like closure via state callback
    pendingQueueRef.current = { files, index };
  };

  // Using a ref object to carry queue state across the modal's async callback
  const pendingQueueRef = useRef<{ files: File[]; index: number }>({
    files: [],
    index: 0,
  });

  const handleCropComplete = (croppedFile: File, previewUrl: string) => {
    setQueue((prev) => [
      ...prev,
      { type: "new", id: crypto.randomUUID(), file: croppedFile, previewUrl },
    ]);
    setPendingCrop(null);

    const { files, index } = pendingQueueRef.current;
    processNextFile(files, index + 1);
  };

  const handleCropCancel = () => {
    setPendingCrop(null);
    // Skip this file, move to the next one in the batch
    const { files, index } = pendingQueueRef.current;
    processNextFile(files, index + 1);
  };

  const removeFromQueue = async (item: QueuedImage) => {
    if (item.type === "existing") {
      // Existing image: delete it from the server right away
      const confirmed = window.confirm("Delete this image permanently?");
      if (!confirmed) return;

      const params = {
        url: `${endpoints.ProductImages}?image_id=${item.imageId}&product_id=${product?.product_id}`,
        isToast: true,
      };
      const res = await deleteData(params);
      if (res?.status === 200) {
        setQueue((prev) => prev.filter((q) => q.id !== item.id));
      }
    } else {
      // New, not-yet-uploaded image: just remove from local state,
      // no server call needed, and revoke the blob URL to free memory.
      URL.revokeObjectURL(item.previewUrl);
      setQueue((prev) => prev.filter((q) => q.id !== item.id));
    }
  };

  const handleUpload = async () => {
    const newItems = queue.filter(
      (q): q is Extract<QueuedImage, { type: "new" }> => q.type === "new",
    );

    if (newItems.length === 0) {
      setError("No new images to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      newItems.forEach((q) => formData.append("image", q.file));

      const res = await fetch(
        `/api${endpoints.ProductImages}?product_id=${product?.product_id}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast(`${data.message}`);
      }
      if (!res.ok) {
        toast(`${data.message}`);
      }

      // Replace the "new" queue items with "existing" ones using the server's response,
      // so their previewUrl now points to the permanent path instead of a blob URL.
      setQueue((prev) => [
        ...prev.filter((q) => q.type === "existing"),
        ...data.result.map((img: { image_id: number; image_url: string }) => ({
          type: "existing" as const,
          id: `existing-${img.image_id}`,
          imageId: img.image_id,
          previewUrl: img.image_url,
        })),
      ]);

      // onSaved?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p>Add Image</p>
          {queue.length > 0 && (
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <Spinner />
              ) : (
                `Upload ${queue.length} image${queue.length > 1 ? "s" : ""}`
              )}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Product Name: {` `}
          {convertToTitleCase(product?.product_name as string)}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {loading ? (
          <Spinner />
        ) : (
          <div className="space-y-3">
            {remainingSlots > 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded p-6 h-50 text-center cursor-pointer transition-colors
      ${isDragging ? "border-black bg-gray-50" : "border-gray-300"}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <p className="text-sm text-gray-600">
                  <span className="font-medium underline">Click to upload</span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG or WEBP — up to {remainingSlots} more image
                  {remainingSlots > 1 ? "s" : ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Maximum of {MAX_IMAGES} images reached for this product.
              </p>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {queue.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-4/5 rounded border overflow-hidden"
                  >
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromQueue(item)}
                      className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded px-1.5 py-0.5"
                    >
                      ✕
                    </button>
                    {item.type === "existing" && (
                      <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-1 rounded">
                        Saved
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {pendingCrop && (
              <ImageCropModal
                imageSrc={pendingCrop.src}
                fileName={pendingCrop.name}
                mimeType={pendingCrop.type}
                onCancel={handleCropCancel}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddEditProductImage;
