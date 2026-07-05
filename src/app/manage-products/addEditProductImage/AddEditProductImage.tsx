"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProduct } from "@/store/slices/productSlice";

interface Props {
  product: IProduct | undefined;
}

const AddEditProductImage = ({ product }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Product Image</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {product && "Add Product Image"}
      </CardContent>
    </Card>
  );
};

export default AddEditProductImage;
