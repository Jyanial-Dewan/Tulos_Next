import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CatgoriesTable from "./catagories/CatgoriesTable";

const ManageProductMetadata = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Catagories</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <CatgoriesTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Catagories</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <CatgoriesTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Catagories</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <CatgoriesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageProductMetadata;
