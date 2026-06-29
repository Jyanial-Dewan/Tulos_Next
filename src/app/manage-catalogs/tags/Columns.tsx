import { ITag } from "@/store/slices/catalogSlice";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const getColumns = (): ColumnDef<ITag>[] => [
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
    accessorKey: "tag_name",
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
          Tag Name
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="min-w-max p-1">{row.getValue("tag_name")}</div>
    ),
  },
];
