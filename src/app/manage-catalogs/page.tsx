"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CatgoriesTable from "./catagories/CatgoriesTable";
import CollectionTable from "./collections/CollectionTable";

const ManageProductMetadata = () => {
  const [catalogType, setCatalogType] = React.useState("");
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Catagories */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Catagories</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <CatgoriesTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
        {/* Collections */}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Collections</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <CollectionTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageProductMetadata;
