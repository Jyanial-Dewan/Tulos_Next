import { IColor, ISize } from "@/store/slices/catalogSlice";
import { IProductVariant } from "@/store/slices/productSlice";
import { colorName, sizeName } from "@/utility/general";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const getColumns = (
  colors: IColor[],
  sizes: ISize[],
): ColumnDef<IProductVariant>[] => [
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
    accessorKey: "variant_id",
    enableResizing: true,

    sortingFn: (rowA, rowB, columnId) => {
      const a = Number(rowA.getValue(columnId));
      const b = Number(rowB.getValue(columnId));

      return a - b;
    },

    header: ({ column }) => (
      <div
        className="min-w-max cursor-pointer p-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Variant Id
        <ArrowUpDown className="ml-2 inline-block h-4 w-4" />
      </div>
    ),

    cell: ({ row }) => (
      <div className="p-1">{row.getValue<number>("variant_id")}</div>
    ),
  },

  {
    accessorKey: "color_id",
    enableResizing: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = colorName(rowA.getValue(columnId), colors) as string;
      const b = colorName(rowB.getValue(columnId), colors) as string;

      return a.localeCompare(b, undefined, { sensitivity: "base" });
    },
    header: ({ column }) => {
      return (
        <div
          className="min-w-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="min-w-max p-1">
        {colorName(row.getValue("color_id"), colors)}
      </div>
    ),
  },

  {
    accessorKey: "size_id",
    enableResizing: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = sizeName(rowA.getValue(columnId), sizes) as string;
      const b = sizeName(rowB.getValue(columnId), sizes) as string;

      return a.localeCompare(b, undefined, { sensitivity: "base" });
    },
    header: ({ column }) => {
      return (
        <div
          className="min-w-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="min-w-max p-1">
        {sizeName(row.getValue("size_id"), sizes)}
      </div>
    ),
  },

  {
    accessorKey: "sku",
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
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => <div className="p-1">{row.getValue("sku")}</div>,
  },

  {
    accessorKey: "barcode",
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
          Barcode
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => <div className="p-1">{row.getValue("barcode")}</div>,
  },

  {
    accessorKey: "price",
    enableResizing: true,

    sortingFn: (rowA, rowB, columnId) => {
      const a = Number(rowA.getValue(columnId));
      const b = Number(rowB.getValue(columnId));

      return a - b;
    },

    header: ({ column }) => (
      <div
        className="min-w-max cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 inline-block h-4 w-4" />
      </div>
    ),

    cell: ({ row }) => (
      <div className="p-1">{row.getValue<number>("price")}</div>
    ),
  },

  {
    accessorKey: "stock",
    enableResizing: true,

    sortingFn: (rowA, rowB, columnId) => {
      const a = Number(rowA.getValue(columnId));
      const b = Number(rowB.getValue(columnId));

      return a - b;
    },

    header: ({ column }) => (
      <div
        className="min-w-max cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stock
        <ArrowUpDown className="ml-2 inline-block h-4 w-4" />
      </div>
    ),

    cell: ({ row }) => (
      <div className="p-1">{row.getValue<number>("stock")}</div>
    ),
  },
];
