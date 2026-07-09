"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/hooks/useAppStore";
import {
  IProduct,
  IProductTags,
  IProductVariant,
} from "@/store/slices/productSlice";
import { colorName, sizeName, tagName } from "@/utility/general";
import { loadData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SingleProduct = () => {
  const { tags, colors, sizes } = useAppSelector((state) => state.catalog);
  const params = useParams<{ product_id: string }>();
  const productId = Number(params.product_id);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [productVariants, setProductVariants] = useState<IProductVariant[]>([]);
  const [productTags, setProductTags] = useState<IProductTags[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<
    IProductVariant | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const productParams = {
        url: `${endpoints.Products}?product_id=${productId}`,
        setLoading: setLoading,
      };
      const productVariantParams = {
        url: `${endpoints.ProductVariants}?product_id=${productId}`,
        setLoading: setLoading,
      };
      const productTagsParams = {
        url: `${endpoints.ProductTags}?product_id=${productId}`,
        setLoading: setLoading,
      };

      const productRes = await loadData(productParams);
      const producVariantRes = await loadData(productVariantParams);
      const productTagsRes = await loadData(productTagsParams);
      if (
        productRes?.status === 200 &&
        producVariantRes?.status === 200 &&
        productTagsRes?.status === 200
      ) {
        setProduct(productRes.data.result);
        setSelectedImageUrl(productRes.data.result.image_urls?.[0]);
        setProductVariants(producVariantRes.data.result);
        setSelectedVariant(producVariantRes.data.result[0]);
        setProductTags(productTagsRes.data.result);
      }
    })();
  }, [productId]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-[80vh]">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          {/* Image Section */}
          <div className="col-span-5 md:col-span-3 grid grid-cols-3 gap-6 border p-4 ">
            {/* Selected Image */}
            <div className="col-span-3 md:col-span-2 flex items-center justify-center">
              {selectedImageUrl ? (
                <Image
                  src={selectedImageUrl}
                  alt={"Product Image"}
                  width={300}
                  height={375}
                />
              ) : (
                <div className="w-10 h-15 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
            {/* All Image */}
            <div className="col-span-3 md:col-span-1 flex md:flex-col items-center justify-center gap-3">
              {product?.image_urls &&
                product.image_urls.map((url) => (
                  <div
                    key={url}
                    className={`p-4 border cursor-pointer flex-1 flex justify-center items-center ${url === selectedImageUrl && "border-black"}`}
                    onClick={() => setSelectedImageUrl(url)}
                  >
                    <Image
                      src={url}
                      alt="Product Image"
                      width={60}
                      height={75}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="col-span-5 md:col-span-2 md:max-h-[80vh] overflow-auto scrollbar-thin flex flex-col p-4">
            <h1 className="text-2xl font-bold">{product?.product_name}</h1>
            {/* Price */}
            <div className="mt-6 flex gap-2 items-center text-gray-600 font-extrabold">
              <p>$ {selectedVariant?.price}</p>
            </div>

            {/* Variants */}
            <div className="mt-8">
              <p className="text-lg font-semibold">Product Variants</p>
              <div className="flex gap-4 flex-wrap">
                {productVariants?.map((v) => (
                  <div
                    key={v.variant_id}
                    className={`px-4 py-2 border rounded-md cursor-pointer ${v.variant_id === selectedVariant?.variant_id && "border-black"}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.color_id && (
                      <p className="text-sm">
                        Color: {colorName(v.color_id, colors)}
                      </p>
                    )}
                    {v.size_id && (
                      <p className="text-sm">
                        Size: {sizeName(v.size_id, sizes)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8">
              <p className="text-lg font-semibold">Product Tags</p>
              <div className="flex gap-4 flex-wrap">
                {productTags?.map((t) => (
                  <div key={t.tag_id} className="px-2 bg-gray-300 rounded-md">
                    <p className="text-sm">{tagName(t.tag_id, tags)}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Description */}
            <div className="mt-6 ">
              <p className="text-lg font-semibold">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {product?.description}
              </p>
            </div>

            {/* Add to cart Button */}
            <div className="flex h-10 items-center justify-center gap-4 bg-black px-2 py-1 cursor-pointer text-white w-full md:w-auto mt-6">
              <p className="font-semibold">Add to Cart</p>
              <Plus />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
