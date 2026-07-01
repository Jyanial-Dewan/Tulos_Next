"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import FashionMoodboard from "./FassionMoodBoard";
import SearchInput from "../searchInput/SearchInput";

const items = Array.from({ length: 9 }).map((_, i) => i);
const cats = ['All','Men', 'Women','Kid']

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const maxIndex = items.length - 3;

  const [newWeekIndex, setNewWeekIndex] = useState(0);
  const maxNewWeekIndex = items.length - 4;

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
            setQuery={()=>{}}
            setPage={()=>{}}
          />
        </div>
      </div>
      {/* Carosel 1 */}
      <div className="grid grid-cols-4 gap-5 h-80 w-full">
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
                <ChevronLeft />
              </button>
              <button
                disabled={index >= maxIndex}
                onClick={() => setIndex((p) => Math.min(maxIndex, p + 1))}
                className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-3 overflow-hidden">
          <div
            className="flex gap-[2%] transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${index * 34}%)` }}
          >
            {items.map((item) => (
              <div key={item} className="min-w-[32%] shrink-0 ">
                <div className="bg-amber-200 h-full flex items-center justify-center">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Carosel 2 */}
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="font-extrabold text-4xl">NEW</h2>
          <div className="flex justify-between items-center">
            <div className="relative inline-block">
              <h2 className="font-extrabold text-4xl">THIS WEEK</h2>
              <span className="absolute -top-5 -right-10 text-blue-600 font-extrabold text-lg">(40)</span>
            </div>
            <Link href='/'>See All</Link>
          </div>
        </div>
        <div className="overflow-hidden h-96">
          <div
            className="flex gap-[2%] transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${newWeekIndex * 25.5}%)` }}
          >
            {items.map((item) => (
              <div key={item} className="min-w-[23.5%] shrink-0 relative">
                <div className="bg-gray-50 h-80 flex items-center justify-center border">
                  <span>{item}</span> 
                  <span className="absolute bottom-16 bg-gray-300 p-2 flex justify-center items-center">
                    <Plus/></span>
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
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={newWeekIndex === 0}
            onClick={() => setNewWeekIndex((p) => Math.max(0, p - 1))}
            className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ChevronLeft />
          </button>
          <button
            disabled={newWeekIndex >= maxNewWeekIndex}
            onClick={() =>
              setNewWeekIndex((p) => Math.min(maxNewWeekIndex, p + 1))
            }
            className="w-10 h-10 border-1 border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {/*Collection 23-24*/}
      <div className="flex flex-col gap-[2%]">
        <div>
          <h2 className="font-extrabold text-4xl">XIV</h2>
          <h2 className="font-extrabold text-4xl">COLLECTIONS</h2>
          <h2 className="font-extrabold text-4xl">23-24</h2>
        </div>
        <div className="flex gap-[2%] my-8 border-b-2">
          {cats.map((c,i)=>(
            <div key={i}>{c}</div>
          ))}
        </div>
        <div className="overflow-hidden h-96">
          <div
            className="flex gap-[2%] transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${newWeekIndex * 25.5}%)` }}
          >
            {items.map((item) => (
              <div key={item} className="min-w-[23.5%] shrink-0 relative">
                <div className="bg-gray-50 h-80 flex items-center justify-center border">
                  <span>{item}</span> 
                  <span className="absolute bottom-16 bg-gray-300 p-2 flex justify-center items-center">
                    <Plus/></span>
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
              <ChevronDown/>
            </Link> 
        </div>
      </div>
      {/* Approach */}
      <div className=" ">
        <div className="flex flex-col items-center justify-center w-[60%] mx-auto">
          <h2 className="font-bold text-4xl">OUR APPROACH TO FASHION DESIGN</h2>
          <p className="text-center">at elegant vogue, we blend creativity with craftsmanship to create fashion that transcends trends and stands the test of time each design is meticulously crafted, ensuring the highest quelity exqulsite finish</p>
        </div>
        <FashionMoodboard/>
      </div>
    </div>
  );
}
