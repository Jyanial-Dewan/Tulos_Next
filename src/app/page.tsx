"use client";

import { useAppSelector } from "@/hooks/useAppStore";
import {} from "@/features/counter/counterSlice";

export default function Home() {
  const { access_token } = useAppSelector((state) => state.user.token);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="font-bold text-7xl">Home</h1>
      <div className="flex gap-2 items-center mt-4">
        <h1 className="text-4xl font-mono w-16 text-center">{access_token}</h1>
      </div>
    </div>
  );
}
