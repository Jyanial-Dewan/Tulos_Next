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
import { FileEdit, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getColumns } from "./Columns";
import Modal from "./Modal";
import { endpoints } from "@/variables/variables";
import { deleteData, loadData, putData } from "@/utility/httpRequest";
import ActionButtons from "@/components/actionButton/ActionButton";
import Alert from "@/components/alert/CustomAlert";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { IProduct, IProductVariant } from "@/store/slices/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  product: IProduct | undefined;
}

const ManageProductVariants = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const { colors, sizes } = useAppSelector((state) => state.catalog);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<IProductVariant[] | []>([]);
  const [selectedProductVariants, setSelectedProductVariants] = React.useState<
    IProductVariant[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [reloadController, setReloadController] = React.useState(1);
  const [isloaded, setIsloaded] = React.useState(false);
  const [action, setAction] = React.useState("");

  console.log(selectedIds, data);

  const columns = React.useMemo(
    () => getColumns(colors, sizes),
    [colors, sizes],
  );
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
      url: `${endpoints.ProductVariants}?product_id=${product?.product_id}`,
      // accessToken: `${token.access_token}`,
      setLoading: setIsLoading,
    };

    const fetchVariants = async () => {
      const res = await loadData(params);

      if (res?.data) {
        setData(res.data.result);
      }
      setSelectedProductVariants([]);
      setIsloaded(true);
    };

    const delayDebounce = setTimeout(() => {
      fetchVariants();
      //   setSelectedItem(null);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [table, reloadController, dispatch, product?.product_id]);

  React.useEffect(() => {
    if (data?.length > 0) {
      if (selectedProductVariants.length !== data.length) {
        setIsSelectAll(false);
      } else {
        setIsSelectAll(true);
      }
    }

    const ids =
      selectedProductVariants
        ?.map((item) => item.variant_id)
        .filter((id): id is number => id !== undefined) ?? [];

    setSelectedIds(ids);
  }, [data.length, selectedProductVariants]);

  const handleRowSelection = (rowData: IProductVariant) => {
    setSelectedProductVariants((prev) => {
      const size = prev.find((item) => item.variant_id === rowData.variant_id);

      if (size) {
        const filtered = prev.filter(
          (item) => item.variant_id !== rowData.variant_id,
        );
        return filtered;
      } else {
        return [rowData, ...prev];
      }
    });
  };

  const handleAdd = () => {
    setAction("add");
    setOpenModal(true);
  };
  const handleEdit = () => {
    setAction("edit");
    setOpenModal(true);
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setIsSelectAll(false);
      setSelectedProductVariants([]);
    } else {
      setIsSelectAll(true);
      setSelectedProductVariants(data);
    }
  };

  const handleDelete = () => {
    setData((prev) => {
      const filteredVariants = prev.filter(
        (variant) => !selectedIds.includes(variant.variant_id),
      );

      return filteredVariants;
    });
  };

  const handleSave = async () => {
    const params = {
      url: `${endpoints.ProductVariants}?product_id=${product?.product_id}`,
      setLoading: setIsSubmitting,
      payload: { variants: data },
      // isConsole?: true,
      isToast: true,
      //  accessToken?: string;
    };

    const res = await putData(params);

    if (res?.status === 200) {
      setReloadController((prev) => prev + 1);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Product Variants</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Action Item */}
        <div className="mb-4 flex justify-between items-center">
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
              disabled={selectedProductVariants.length !== 1}
            >
              <FileEdit />
              <p className="hidden md:block">Edit</p>
            </Button>

            <Alert
              disabled={selectedProductVariants.length === 0}
              actionName="delete"
              onContinue={handleDelete}
              tooltipTitle="Delete"
            >
              <span className="flex flex-col items-start">
                {selectedProductVariants.map((item, index) => (
                  <span key={item.size_id}>
                    {index + 1}. Variant : {item.variant_id}
                  </span>
                ))}
              </span>
            </Alert>
          </ActionButtons>
          <Button
            disabled={isSubmitting}
            onClick={handleSave}
            className="flex gap-1 items-center"
          >
            {isSubmitting ? <Spinner /> : <Save />}
            <p>Save</p>
          </Button>
        </div>

        {/* Table */}
        <div className="h-50">
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
                            checked={selectedIds.includes(
                              row.original.variant_id,
                            )}
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
          selectedItems={selectedProductVariants}
          setData={setData}
          product={product}
        />
      </CardContent>
    </Card>
  );
};

export default ManageProductVariants;
