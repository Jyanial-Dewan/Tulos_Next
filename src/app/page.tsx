"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import {
  increment,
  decrement,
  reset,
  incrementByAmount,
} from "@/features/counter/counterSlice";

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="font-bold text-7xl">Home</h1>
      <div className="flex gap-2 items-center mt-4">
        <h1 className="text-4xl font-mono w-16 text-center">{count}</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => dispatch(reset())}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => dispatch(incrementByAmount(5))}
        >
          +5
        </button>
      </div>
    </div>
  );
}
