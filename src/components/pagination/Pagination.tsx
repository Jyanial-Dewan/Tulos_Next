"use client";

import { useState } from "react";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const page = Number(pageInput);

    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      toast(`Please enter a page between 1 and ${totalPages}.`);
      return;
    }

    setCurrentPage(page);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="rounded border p-2 disabled:opacity-40"
      >
        <ChevronFirst size={16} />
      </button>

      <button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
        className="rounded border p-2 disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      <span>Page</span>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          className="w-16 rounded border px-2 py-1 text-center"
        />
      </form>

      <span>of {totalPages}</span>

      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage === totalPages}
        className="rounded border p-2 disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>

      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="rounded border p-2 disabled:opacity-40"
      >
        <ChevronLast size={16} />
      </button>
    </div>
  );
}
