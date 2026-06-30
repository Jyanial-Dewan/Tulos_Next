"use client";

import React, { Suspense, useState } from "react";
import AddEditProduct from "../addEditProduct/AddEditProduct";
import { Spinner } from "@/components/ui/spinner";

const Page = () => {
  const [productId, setProductId] = useState<number | null>(null);
  console.log(productId);
  return (
    <div className="grid md:grid-cols-2">
      <Suspense fallback={<Spinner />}>
        <AddEditProduct setProductId={setProductId} />
      </Suspense>
    </div>
  );
};

export default Page;
