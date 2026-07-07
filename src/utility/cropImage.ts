export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

// Renders the cropped region onto a canvas and returns a File,
// re-encoding at decreasing quality if needed to stay under maxSizeBytes.
export async function getCroppedImgFile(
  imageSrc: string,
  cropArea: CropArea,
  fileName: string,
  mimeType: string = "image/jpeg",
  maxSizeBytes: number = 1 * 1024 * 1024,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  );

  // PNG has no quality param, so only step down quality for jpeg/webp
  const canReduceQuality =
    mimeType === "image/jpeg" || mimeType === "image/webp";
  let quality = 0.92;

  const toBlob = (q: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
        mimeType,
        q,
      );
    });

  let blob = await toBlob(quality);

  while (blob.size > maxSizeBytes && canReduceQuality && quality > 0.4) {
    quality -= 0.1;
    blob = await toBlob(quality);
  }

  if (blob.size > maxSizeBytes) {
    throw new Error(
      "Could not compress image below 1MB. Try a smaller source image.",
    );
  }

  return new File([blob], fileName, { type: mimeType });
}
