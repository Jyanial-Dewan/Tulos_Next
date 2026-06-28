"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CatgoriesTable from "./catagories/CatgoriesTable";
import CollectionTable from "./collections/CollectionTable";
import ColorTable from "./colors/ColorTable";
import TagTable from "./tags/TagTable";
import SizeTable from "./sizes/SizeTable";
import GenderTable from "./genders/GenderTable";
import AvailabilityTable from "./availabilities/AvailabilityTable";
import BrandTable from "./brands/BrandTable";

const ManageProductMetadata = () => {
  const [catalogType, setCatalogType] = React.useState("");
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Catagories */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <CatgoriesTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>
      {/* Collections */}
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

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Colors</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ColorTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Tags</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <TagTable catalogType={catalogType} setCatalogType={setCatalogType} />
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Sizes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <SizeTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>
      {/* Genders */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Genders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <GenderTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>

      {/* Availabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Availabilities</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <AvailabilityTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Brands</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <BrandTable
            catalogType={catalogType}
            setCatalogType={setCatalogType}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageProductMetadata;
