"use client";

import React, { Suspense, useState } from "react";
import AddEditProduct from "../addEditProduct/AddEditProduct";
import { Spinner } from "@/components/ui/spinner";
import AddEditProductImage from "../addEditProductImage/AddEditProductImage";
import { IProduct } from "@/store/slices/productSlice";
import ManageProductVariants from "../manageProductVariants/ManageProductVariants";

const Page = () => {
  const [product, setProduct] = useState<IProduct | undefined>(undefined);

  return (
    <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0">
      <Suspense fallback={<Spinner />}>
        <AddEditProduct setProduct={setProduct} action="add" />
      </Suspense>
      <AddEditProductImage product={product} />
      <div className="col-span-2">
        {product && <ManageProductVariants product={product} />}
      </div>
    </div>
  );
};

export default Page;
