"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { Suspense, useEffect, useState } from "react";
import AddEditProduct from "../addEditProduct/AddEditProduct";
import AddEditProductImage from "../addEditProductImage/AddEditProductImage";
import { IProduct } from "@/store/slices/productSlice";
import ManageProductVariants from "../manageProductVariants/ManageProductVariants";
import { useParams } from "next/navigation";
import { loadData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";

const Page = () => {
  const params = useParams<{ product_id: string }>();
  const productId = Number(params.product_id);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await loadData({
        url: `${endpoints.Products}?product_id=${productId}`,
        // setLoading: setIsLoading,
        //   accessToken: token.access_token,
      });

      if (res?.status == 200) {
        setProduct(res.data.result);
      }
    };

    fetchProduct();
  }, [productId]);
  return (
    <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0">
      <Suspense fallback={<Spinner />}>
        <AddEditProduct action="edit" product={product} />
      </Suspense>
      <AddEditProductImage product={product} />
      <div className="col-span-2">
        {product && <ManageProductVariants product={product} />}
      </div>
    </div>
  );
};

export default Page;
