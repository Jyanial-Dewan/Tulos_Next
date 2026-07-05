"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

const items = Array.from({ length: 9 }).map((_, i) => i);

export default function NewThisWeek() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  let isDown = false;
  let startX = 0;
  let scrollLeftPos = 0;

  // mouse drag start hole position track kore
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDown = true;
    startX = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeftPos = carouselRef.current?.scrollLeft ?? 0;
  };

  // mouse drag end / leave
  const handleMouseLeave = () => { isDown = false; };
  const handleMouseUp = () => { isDown = false; };

  // mouse drag kore scroll-left update
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeftPos - walk;
    }
  };

  // mobile touch start position record kore
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // mobile swipe detect kore smoothScroll call kore
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      smoothScroll(diff > 0 ? 1 : -1);
    }
  };

  // scroll position check kore button disable/enable kore
  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  // custom smooth scroll animation (ease-in-out cubic)
  const smoothScroll = (direction: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;

    const start = el.scrollLeft;
    const target = start + el.clientWidth * direction;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      el.scrollLeft = start + (target - start) * ease;

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  return (
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
        <style>{`#carosel2::-webkit-scrollbar { display: none; }`}</style>
        <div
          id="carosel2"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex gap-[2%] h-full overflow-x-auto cursor-grab active:cursor-grabbing flex-nowrap"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item) => (
            <div key={item} className="min-w-[45%] md:min-w-[30%] lg:min-w-[23.5%] shrink-0 relative">
              <div className="bg-gray-50 h-48 md:h-80 flex items-center justify-center border">
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
      <div className="hidden md:flex items-center justify-center gap-2">
        <button
          disabled={!canScrollLeft}
          onClick={() => smoothScroll(-1)}
          className="w-10 h-10 border border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          <ChevronLeft />
        </button>
        <button
          disabled={!canScrollRight}
          onClick={() => smoothScroll(1)}
          className="w-10 h-10 border border-gray-200 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
