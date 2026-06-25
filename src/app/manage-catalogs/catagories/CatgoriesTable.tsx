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
import { ChevronDown, FileEdit, Plus } from "lucide-react";
// import Rows from "@/components/Rows/Rows";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getColumns } from "./Columns";
import { ICatagory } from "@/store/slices/productSlice";
import Modal from "./Modal";
import { endpoints } from "@/variables/variables";
import { deleteData, loadData } from "@/utility/httpRequest";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import ActionButtons from "@/components/actionButton/ActionButton";
import Alert from "@/components/alert/CustomAlert";
import { Spinner } from "@/components/ui/spinner";
import { convertToTitleCase } from "@/utility/general";

const CatgoriesTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<ICatagory[] | []>([]);
  const [selectedCatagories, setSelectedCatagories] = React.useState<
    ICatagory[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [action, setAction] = React.useState("");
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [reloadController, setReloadController] = React.useState(1);

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
      url: `${endpoints.Catagories}`,
      // accessToken: `${token.access_token}`,
      setLoading: setIsLoading,
    };

    const fetchCatagories = async () => {
      const res = await loadData(params);
      if (res?.data) {
        setData(res.data.result);
        // setTotalPage(res.pages);
      }
      setSelectedCatagories([]);
    };

    const delayDebounce = setTimeout(() => {
      fetchCatagories();
      //   setSelectedItem(null);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [table, reloadController]);

  React.useEffect(() => {
    if (data?.length > 0) {
      if (selectedCatagories.length !== data.length) {
        setIsSelectAll(false);
      } else {
        setIsSelectAll(true);
      }
    }
    const ids = selectedCatagories?.map((item) => item.catagory_id);
    setSelectedIds(ids);
  }, [data.length, selectedCatagories]);

  const handleRowSelection = (rowData: ICatagory) => {
    setSelectedCatagories((prev) => {
      const lookupValue = prev.find(
        (item) => item.catagory_id === rowData.catagory_id,
      );

      if (lookupValue) {
        const filtered = prev.filter(
          (item) => item.catagory_id !== rowData.catagory_id,
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
      setSelectedCatagories([]);
    } else {
      setIsSelectAll(true);
      setSelectedCatagories(data);
    }
  };

  const handleDelete = async () => {
    const params = {
      url: endpoints.Catagories,
      payload: {
        lookup_value_ids: selectedIds,
      },
      isToast: true,
      setLoading: setIsDeleteLoading,
      // accessToken: token.access_token,
    };

    const res = await deleteData(params);
    if (res.status === 200) {
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
            disabled={selectedCatagories.length !== 1}
          >
            <FileEdit />
            <p className="hidden md:block">Edit</p>
          </Button>

          <Alert
            disabled={selectedCatagories.length === 0 || isDeleteLoading}
            actionName="delete"
            onContinue={handleDelete}
            tooltipTitle="Delete"
          >
            <>
              {isDeleteLoading ? (
                <Spinner />
              ) : (
                <span className="flex flex-col items-start">
                  {selectedCatagories.map((item, index) => (
                    <span key={item.catagory_id}>
                      {index + 1}. Catagory Name : {item.catagory_name}
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
        <Table
          style={{
            width: table.getTotalSize(),
            minWidth: "100%",
            // tableLayout: "fixed",
          }}
        >
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
                          disabled={!data?.length}
                          checked={isSelectAll}
                          onClick={handleSelectAll}
                          aria-label="Select all"
                        />
                      )}
                      {header.id !== "select" && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `absolute top-0 right-0 cursor-col-resize w-px h-full hover:w-2`,
                            style: {
                              userSelect: "none",
                              touchAction: "none",
                            },
                          }}
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
                <TableCell
                  colSpan={columns.length}
                  className="h-[16rem] text-center"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                          className="mt-1"
                          checked={selectedIds.includes(
                            row.original.catagory_id,
                          )}
                          onClick={() => handleRowSelection(row.original)}
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
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[16rem] text-center"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[16rem] text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Start Pagination */}
      <div className="flex justify-between p-1">
        <div className="flex-1 text-sm text-gray-600">
          {selectedCatagories?.length} row(s) selected.
        </div>
        {/* <Pagination5
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPageNumbers={totalPage}
        /> */}
      </div>

      {/* Modal */}
      <Modal
        action={action}
        setAction={setAction}
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedItems={selectedCatagories}
        setState={setReloadController}
      />
    </>
  );
};

export default CatgoriesTable;
