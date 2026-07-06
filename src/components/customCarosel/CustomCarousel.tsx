"use client";

import React, { Dispatch, MutableRefObject, SetStateAction, useRef, type MouseEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BreakpointKey = "sm" | "md" | "lg" | "xl" | "2xl";
type ItemsPerScroll = number | Partial<Record<BreakpointKey, number>>;

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  itemClass?: string;
  containerClass?: string;
  showButtons?: boolean;
  buttonContainerClass?: string;
  canScrollLeft: boolean;
  setCanScrollLeft: Dispatch<SetStateAction<boolean>>;
  canScrollRight: boolean;
  setCanScrollRight: Dispatch<SetStateAction<boolean>>;
  itemsPerScroll?: ItemsPerScroll;
  scrollRef?: MutableRefObject<((direction: 1 | -1) => void) | null>;
}

function resolveItemsPerScroll(count: ItemsPerScroll, containerWidth: number): number {
  if (typeof count === "number") return count;
  const breakpoints: { key: BreakpointKey; width: number }[] = [
    { key: "2xl", width: 1536 },
    { key: "xl", width: 1280 },
    { key: "lg", width: 1024 },
    { key: "md", width: 768 },
    { key: "sm", width: 640 },
  ];
  for (const bp of breakpoints) {
    if (containerWidth >= bp.width && count[bp.key] !== undefined) {
      return count[bp.key]!;
    }
  }
  return count.sm ?? 1;
}

export default function Carousel<T,>({
  items,
  renderItem,
  itemClass = "min-w-[45%] md:min-w-[30%] lg:min-w-[23.5%]",
  containerClass = "h-48 md:h-80",
  showButtons = true,
  buttonContainerClass = "hidden md:flex",
  canScrollLeft,
  setCanScrollLeft,
  canScrollRight,
  setCanScrollRight,
  itemsPerScroll = 1,
  scrollRef,
}: CarouselProps<T>) {


  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDown.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeftPos.current = carouselRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };

  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeftPos.current - walk;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const getItemStep = () => {
    const el = carouselRef.current;
    if (!el) return 0;
    const count = resolveItemsPerScroll(itemsPerScroll, el.clientWidth);
    const firstItem = el.children[0] as HTMLElement | undefined;
    if (!firstItem) return el.clientWidth;
    const gapPx = el.clientWidth * 0.02;
    return (firstItem.offsetWidth + gapPx) * count;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      smoothScroll(diff > 0 ? 1 : -1);
    }
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const smoothScroll = (direction: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;

    const step = getItemStep();
    const start = el.scrollLeft;
    const target = start + step * direction;
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

  if (scrollRef) scrollRef.current = smoothScroll;

  return (
    <>
      <style>{`.carousel-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div
        className={`carousel-scrollbar flex gap-[2%] overflow-x-auto cursor-grab active:cursor-grabbing select-none flex-nowrap ${containerClass}`}
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item, i) => (
          <div key={i} className={`shrink-0 ${itemClass}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      {showButtons && (
        <div className={`items-center justify-center gap-2 ${buttonContainerClass}`}>
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
      )}
    </>
  );
}
