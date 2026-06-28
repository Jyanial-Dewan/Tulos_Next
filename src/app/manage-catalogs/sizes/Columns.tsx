import { ICatagory, ISize } from "@/store/slices/productSlice";
import { categoryName } from "@/utility/general";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const getColumns = (catagories: ICatagory[]): ColumnDef<ISize>[] => [
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
    accessorKey: "catagory_id",
    enableResizing: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = categoryName(rowA.getValue(columnId), catagories) as string;
      const b = categoryName(rowB.getValue(columnId), catagories) as string;

      return a.localeCompare(b, undefined, { sensitivity: "base" });
    },
    header: ({ column }) => {
      return (
        <div
          className="min-w-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="min-w-max p-1">
        {categoryName(row.getValue("catagory_id"), catagories)}
      </div>
    ),
  },
  {
    accessorKey: "size_name",
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
          Size Name
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="min-w-max p-1">{row.getValue("size_name")}</div>
    ),
  },
];
