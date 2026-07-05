import {
  IAvailability,
  IBrand,
  ICollection,
} from "@/store/slices/catalogSlice";
import { IProduct } from "@/store/slices/productSlice";
import { availabilityName } from "@/utility/general";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const getColumns = (
  brands: IBrand[],
  collections: ICollection[],
  availabilities: IAvailability[],
): ColumnDef<IProduct>[] => [
  {
    id: "select",
    size: 24,
    minSize: 24,
    maxSize: 24,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
  {
    accessorKey: "product_name",
    enableResizing: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;

      return a.localeCompare(b, undefined, { sensitivity: "base" });
    },
    header: ({ column }) => {
      return (
        <div
          className="min-w-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="p-1">{row.getValue("product_name")}</div>
    ),
  },
  //   {
  //     accessorKey: "brand_id",
  //     enableResizing: true,
  //     sortingFn: (rowA, rowB, columnId) => {
  //       const a = brandName(rowA.getValue(columnId), brands) as string;
  //       const b = brandName(rowB.getValue(columnId), brands) as string;

  //       return a.localeCompare(b, undefined, { sensitivity: "base" });
  //     },
  //     header: ({ column }) => {
  //       return (
  //         <div
  //           className="min-w-max hidden md:inline"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Brand
  //           <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
  //         </div>
  //       );
  //     },

  //     cell: ({ row }) => (
  //       <div className="min-w-max p-1 hidden md:inline">
  //         {brandName(row.getValue("brand_id"), brands)}
  //       </div>
  //     ),
  //   },
  //   {
  //     accessorKey: "collection_id",
  //     enableResizing: true,
  //     sortingFn: (rowA, rowB, columnId) => {
  //       const a = collectionName(rowA.getValue(columnId), collections) as string;
  //       const b = collectionName(rowB.getValue(columnId), collections) as string;

  //       return a.localeCompare(b, undefined, { sensitivity: "base" });
  //     },
  //     header: ({ column }) => {
  //       return (
  //         <div
  //           className="min-w-max hidden md:inline"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Collection
  //           <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
  //         </div>
  //       );
  //     },

  //     cell: ({ row }) => (
  //       <div className="min-w-max p-1 hidden md:inline">
  //         {collectionName(row.getValue("collection_id"), collections)}
  //       </div>
  //     ),
  //   },
  {
    accessorKey: "availability_id",
    enableResizing: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = availabilityName(
        rowA.getValue(columnId),
        availabilities,
      ) as string;
      const b = availabilityName(
        rowB.getValue(columnId),
        availabilities,
      ) as string;

      return a.localeCompare(b, undefined, { sensitivity: "base" });
    },
    header: ({ column }) => {
      return (
        <div
          className="min-w-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Availability
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="min-w-max p-1">
        {availabilityName(row.getValue("availability_id"), availabilities)}
      </div>
    ),
  },
];
