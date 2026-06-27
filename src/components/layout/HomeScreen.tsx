"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";

const items = Array.from({ length: 9 }).map((_, i) => i);

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const maxIndex = items.length - 3;

  const [newWeekIndex, setNewWeekIndex] = useState(0);
  const maxNewWeekIndex = items.length - 4;

  return (
    <div className="flex flex-col gap-20 pt-10 min-h-screen">
      <div className="flex flex-col ">
        <div className="w-48 gap-1 flex flex-col justify-center">
          <Link href="/mem">MEM</Link>
          <Link href="/wOMEM">WOMEM</Link>
          <Link href="/kids">KIDS</Link>
          <Input placeholder="Enter text" className="rounded-[3px]" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 h-80 w-full">
        <div className="col-span-1 grid grid-cols-1 content-between h-full">
          <div>
            <h2 className="font-extrabold text-4xl">NEW</h2>
            <h2 className="font-extrabold text-4xl">COLLECTION</h2>
            <h4>Summer</h4>
            <h4>2026</h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex w-full h-10 items-center justify-between bg-[#cdcdcd] px-5 py-1">
              <Link href="/kids">Go To Shop</Link> <ArrowRight />
            </div>
            <div className="flex gap-2">
              <button
                disabled={index === 0}
                onClick={() => setIndex((p) => Math.max(0, p - 1))}
                className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <ArrowLeft />
              </button>
              <button
                disabled={index >= maxIndex}
                onClick={() => setIndex((p) => Math.min(maxIndex, p + 1))}
                className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-3 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${index * 33.333}%)` }}
          >
            {items.map((item) => (
              <div key={item} className="min-w-[33.333%] shrink-0 p-2">
                <div className="bg-amber-200 h-full flex items-center justify-center">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p>New This Week</p>
        <div className="overflow-hidden h-72">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${newWeekIndex * 25}%)` }}
          >
            {items.map((item) => (
              <div key={item} className="min-w-[25%] shrink-0 p-2">
                <div className="bg-amber-200 h-full flex items-center justify-center">
                  <span>{item}</span> <p>ABC</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={newWeekIndex === 0}
            onClick={() => setNewWeekIndex((p) => Math.max(0, p - 1))}
            className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ArrowLeft />
          </button>
          <button
            disabled={newWeekIndex >= maxNewWeekIndex}
            onClick={() =>
              setNewWeekIndex((p) => Math.min(maxNewWeekIndex, p + 1))
            }
            className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
