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
import { endpoints } from "@/variables/variables";
import { deleteData, loadData } from "@/utility/httpRequest";
import ActionButtons from "@/components/actionButton/ActionButton";
import Alert from "@/components/alert/CustomAlert";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { IProduct } from "@/store/slices/productSlice";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/searchInput/SearchInput";
import Rows from "@/components/rows/Rows";
import Pagination from "@/components/pagination/Pagination";

const Products = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { availabilities, collections, brands } = useAppSelector(
    (state) => state.catalog,
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<IProduct[] | []>([]);
  const [selectedProdcuts, setSelectedProdcuts] = React.useState<IProduct[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [reloadController, setReloadController] = React.useState(1);
  const [isloaded, setIsloaded] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit, setLimit] = React.useState(8);
  const [query, setQuery] = React.useState("");
  const [totalPage, setTotalPage] = React.useState(1);

  const columns = React.useMemo(
    () => getColumns(brands, collections, availabilities),
    [brands, collections, availabilities],
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
      url: `${endpoints.Products}?product_name=${query}&page=${currentPage}&limit=${limit}`,
      // accessToken: `${token.access_token}`,
      setLoading: setIsLoading,
    };

    const fetchSizes = async () => {
      const res = await loadData(params);

      if (res?.data) {
        setTotalPage(res.data.totalPages);
        setData(res.data.result);
      } else {
        setTotalPage(1);
      }
      setSelectedProdcuts([]);
      setIsloaded(true);
    };

    const delayDebounce = setTimeout(() => {
      fetchSizes();
      //   setSelectedItem(null);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [table, reloadController, dispatch, query, currentPage, limit]);

  React.useEffect(() => {
    if (data?.length > 0) {
      if (selectedProdcuts.length !== data.length) {
        setIsSelectAll(false);
      } else {
        setIsSelectAll(true);
      }
    }
    const ids = selectedProdcuts?.map((item) => item.product_id);
    setSelectedIds(ids);
  }, [data.length, selectedProdcuts]);

  const handleRowSelection = (rowData: IProduct) => {
    setSelectedProdcuts((prev) => {
      const size = prev.find((item) => item.product_id === rowData.product_id);

      if (size) {
        const filtered = prev.filter(
          (item) => item.product_id !== rowData.product_id,
        );
        return filtered;
      } else {
        return [rowData, ...prev];
      }
    });
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setIsSelectAll(false);
      setSelectedProdcuts([]);
    } else {
      setIsSelectAll(true);
      setSelectedProdcuts(data);
    }
  };

  const handleDelete = async () => {
    const params = {
      url: endpoints.Products,
      payload: {
        product_ids: selectedIds,
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
      <SearchInput
        placeholder="Search by Product Name"
        query={query}
        setQuery={setQuery}
        setPage={setCurrentPage}
      />
      {/* Action Item */}
      <div className="flex my-4 justify-between items-center">
        <ActionButtons>
          <Button
            className="flex gap-1 flex-1 items-center justify-center"
            onClick={() => {
              router.push(`/manage-products/add-product`);
            }}
          >
            <Plus />
            <p className="hidden md:block">Add</p>
          </Button>
          <Button
            className="flex gap-1 flex-1 items-center justify-center"
            disabled={selectedProdcuts.length !== 1}
            onClick={() => {
              router.push(`/manage-products/${selectedProdcuts[0].product_id}`);
            }}
          >
            <FileEdit />
            <p className="hidden md:block">Edit</p>
          </Button>

          <Alert
            disabled={selectedProdcuts.length === 0 || isDeleteLoading}
            actionName="delete"
            onContinue={handleDelete}
            tooltipTitle="Delete"
          >
            <>
              {isDeleteLoading ? (
                <Spinner />
              ) : (
                <span className="flex flex-col items-start">
                  {selectedProdcuts.map((item, index) => (
                    <span key={item.product_id}>
                      {index + 1}. Product Name : {item.product_name}
                    </span>
                  ))}
                </span>
              )}
            </>
          </Alert>
        </ActionButtons>

        {/* Search  */}

        {/* Rows */}
        <Rows limit={limit} setLimit={setLimit} />
      </div>

      {/* Table */}
      <div className="h-72">
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
                            row.original.product_id,
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

      <div className="flex justify-between p-1 mt-4">
        <div className="flex-1 text-sm text-gray-600">
          {selectedProdcuts?.length} row(s) selected.
        </div>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPage}
        />
      </div>
    </>
  );
};

export default Products;
