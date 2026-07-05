"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import FashionMoodboard from "./FassionMoodBoard";
import NewThisWeek from "./NewThisWeek";
import SearchInput from "../searchInput/SearchInput";

const items = Array.from({ length: 9 }).map((_, i) => i);
const cats = ['All', 'Men', 'Women', 'Kid']

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const maxIndex = items.length - 3;

  const [newWeekIndex] = useState(0);

  return (
    <div className="flex flex-col gap-20 pt-10 min-h-screen">
      <div className="flex flex-col ">
        <div className="w-64 gap-1 flex flex-col justify-center">
          <Link href="/mem">MEM</Link>
          <Link href="/wOMEM">WOMEM</Link>
          <Link href="/kids">KIDS</Link>
          <SearchInput
            placeholder="Enter text"
            query={""}
            setQuery={() => { }}
            setPage={() => { }}
          />
        </div>
      </div>
      {/* Carosel 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4  md:h-80 w-full">
        <div className="col-span-1 grid grid-cols-1 md:content-between">
          {/* summer text */}
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">NEW</h2>
            <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">COLLECTION</h2>
            <h4>Summer</h4>
            <h4>2026</h4>
          </div>
          {/* items + Go To Shop */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div
              className="flex col-span-1 overflow-hidden md:hidden gap-[2%] transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * 34}%)` }}
            >
              {items.map((item) => (
                <div key={item} className="min-w-[32%] shrink-0 ">
                  <div className="bg-amber-200 w-64 h-48 flex items-center justify-center">
                    {item}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full h-10 items-center justify-between bg-[#cdcdcd] px-5 py-1">
              <Link href="/kids">Go To Shop</Link> <ArrowRight />
            </div>
            <div className="md:gap-2 hidden md:flex">
              <button
                disabled={index === 0}
                onClick={() => setIndex((p) => Math.max(0, p - 1))}
                className="w-10 h-10 border border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <ChevronLeft />
              </button>
              <button
                disabled={index >= maxIndex}
                onClick={() => setIndex((p) => Math.min(maxIndex, p + 1))}
                className="w-10 h-10 border border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        {/* 2nd */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 overflow-hidden hidden md:block">
          <div
            className="flex gap-[2%] transition-transform duration-500 ease-in-out h-48 sm:h-64 md:h-full"
            style={{ transform: `translateX(-${index * 34}%)` }}
          >
            {items.map((item) => (
              <div key={item} className=" md:min-w-[80%] lg:min-w-[49%] xl:min-w-[32%] shrink-0">
                <div className="bg-amber-200 h-full flex items-center justify-center">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewThisWeek />
      {/*Collection 23-24*/}
      <div className="flex flex-col gap-[2%]">
        <div>
          <h2 className="font-extrabold text-4xl">XIV</h2>
          <h2 className="font-extrabold text-4xl">COLLECTIONS</h2>
          <h2 className="font-extrabold text-4xl">23-24</h2>
        </div>
        {/* Categories */}
        <div className="flex gap-4 md:gap-[2%] my-8 border-b-2">
          {cats.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
        <div className="overflow-hidden h-80 md:h-96">
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2%] transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${newWeekIndex * 25.5}%)` }}
          >
            {items.map((item) => (
              <div key={item} className="col-span-1 shrink-0 relative">
                <div className="bg-gray-50 h-64 md:h-80 min-w-[45%] md:min-w-[30%] lg:min-w-[23.5%] flex items-center justify-center border">
                  <span>{item}</span>
                  <span className="absolute bottom-16 bg-gray-300 p-2 flex justify-center items-center">
                    <Plus /></span>
                </div>
                <div className="pt-4">
                  <p className="text-gray-600">V-Neck T-Shlrt</p>
                  <div className="flex justify-between font-medium">
                    <p>Embroidered Seersucker Shirt</p>
                    <p>$4</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center my-10">
          <Link href='/' className="flex flex-col items-center">
            <>More</>
            <ChevronDown />
          </Link>
        </div>
      </div>
      {/* Approach */}
      <div className=" ">
        <div className="flex flex-col items-center justify-center w-full md:w-[60%] mx-auto">
          <h2 className="font-bold text-4xl">OUR APPROACH TO FASHION DESIGN</h2>
          <p className="md:text-center">at elegant vogue, we blend creativity with craftsmanship to create fashion that transcends trends and stands the test of time each design is meticulously crafted, ensuring the highest quelity exqulsite finish</p>
        </div>
        <FashionMoodboard />
      </div>
    </div>
  );
}
