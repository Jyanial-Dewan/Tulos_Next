"use client";

import HomeScreen from "@/components/layout/HomeScreen";
import {} from "@/features/counter/counterSlice";
import { useAppSelector } from "@/hooks/useAppStore";

export default function Home() {
  const { access_token } = useAppSelector((state) => state.user.token);

  return (
    <div className=" ">
      <HomeScreen />
    </div>
  );
}
