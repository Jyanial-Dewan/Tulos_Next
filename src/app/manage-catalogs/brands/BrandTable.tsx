"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileEdit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getColumns } from "./Columns";
import { IBrand } from "@/store/slices/productSlice";
import Modal from "./Modal";
import { endpoints } from "@/variables/variables";
import { deleteData, loadData } from "@/utility/httpRequest";
import ActionButtons from "@/components/actionButton/ActionButton";
import Alert from "@/components/alert/CustomAlert";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  catalogType: string;
  setCatalogType: React.Dispatch<React.SetStateAction<string>>;
}

const BrandTable = ({ catalogType, setCatalogType }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<IBrand[] | []>([]);
  const [selectedBrands, setSelectedBrands] = React.useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [reloadController, setReloadController] = React.useState(1);
  const [isloaded, setIsloaded] = React.useState(false);
  const [action, setAction] = React.useState("");

  const columns = React.useMemo(() => getColumns(), []);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const hiddenColumns = [
    "created_by",
    "last_updated_by",
    "creation_date",
    "last_update_date",
  ];

  React.useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (hiddenColumns.includes(column.id)) {
        column.toggleVisibility(false);
      }
    });
  }, [table]);

  React.useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (hiddenColumns.includes(column.id)) {
        column.toggleVisibility(false);
      }
    });
  }, [table]);

  React.useEffect(() => {
    const params = {
      url: `${endpoints.Brands}`,
      // accessToken: `${token.access_token}`,
      setLoading: setIsLoading,
    };

    const fetchBrands = async () => {
      const res = await loadData(params);

      if (res?.data) {
        setData(res.data.result);
        // setTotalPage(res.pages);
      }
      setSelectedBrands([]);
      setIsloaded(true);
    };

    const delayDebounce = setTimeout(() => {
      fetchBrands();
      //   setSelectedItem(null);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [table, reloadController]);

  React.useEffect(() => {
    if (data?.length > 0) {
      if (selectedBrands.length !== data.length) {
        setIsSelectAll(false);
      } else {
        setIsSelectAll(true);
      }
    }
    const ids = selectedBrands?.map((item) => item.brand_id);
    setSelectedIds(ids);
  }, [data.length, selectedBrands]);

  const handleRowSelection = (rowData: IBrand) => {
    setSelectedBrands((prev) => {
      const gender = prev.find((item) => item.brand_id === rowData.brand_id);

      if (gender) {
        const filtered = prev.filter(
          (item) => item.brand_id !== rowData.brand_id,
        );
        return filtered;
      } else {
        return [rowData, ...prev];
      }
    });
  };

  const handleAdd = () => {
    setCatalogType("brand");
    setAction("add");
    setOpenModal(true);
  };
  const handleEdit = () => {
    setCatalogType("brand");
    setAction("edit");
    setOpenModal(true);
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setIsSelectAll(false);
      setSelectedBrands([]);
    } else {
      setIsSelectAll(true);
      setSelectedBrands(data);
    }
  };

  const handleDelete = async () => {
    const params = {
      url: endpoints.Brands,
      payload: {
        brand_ids: selectedIds,
      },
      isToast: true,
      setLoading: setIsDeleteLoading,
      // accessToken: token.access_token,
    };

    const res = await deleteData(params);
    if (res?.status === 200) {
      setReloadController((prev) => prev + 1);
    }
  };
  return (
    <>
      {/* Action Item */}
      <div className="mb-4">
        <ActionButtons>
          <Button
            className="flex gap-1 flex-1 items-center justify-center"
            onClick={handleAdd}
          >
            <Plus />
            <p className="hidden md:block">Add</p>
          </Button>
          <Button
            className="flex gap-1 flex-1 items-center justify-center"
            onClick={handleEdit}
            disabled={selectedBrands.length !== 1}
          >
            <FileEdit />
            <p className="hidden md:block">Edit</p>
          </Button>

          <Alert
            disabled={selectedBrands.length === 0 || isDeleteLoading}
            actionName="delete"
            onContinue={handleDelete}
            tooltipTitle="Delete"
          >
            <>
              {isDeleteLoading ? (
                <Spinner />
              ) : (
                <span className="flex flex-col items-start">
                  {selectedBrands.map((item, index) => (
                    <span key={item.brand_id}>
                      {index + 1}. Brand Name : {item.brand_name}
                    </span>
                  ))}
                </span>
              )}
            </>
          </Alert>
        </ActionButtons>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="relative border h-9 py-0 px-1 border-slate-400 bg-slate-200"
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.id === "select" && (
                        <Checkbox
                          className="border border-black"
                          disabled={!data?.length}
                          checked={isSelectAll}
                          onClick={handleSelectAll}
                          aria-label="Select all"
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 p-0">
                  <div className="flex h-full w-full items-center justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 && isloaded ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className="border py-0 px-1"
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                      }}
                    >
                      {index === 0 ? (
                        <Checkbox
                          className="border border-black"
                          checked={selectedIds.includes(row.original.brand_id)}
                          onCheckedChange={() =>
                            handleRowSelection(row.original)
                          }
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Modal
        action={action}
        setAction={setAction}
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedItems={selectedBrands}
        setState={setReloadController}
        catalogType={catalogType}
      />
    </>
  );
};

export default BrandTable;
