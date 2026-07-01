"use client";

import HomeScreen from "@/components/HomeScreen/HomeScreen";
import {} from "@/features/counter/counterSlice";
import { useAppDispatch } from "@/hooks/useAppStore";
import { setToken, UserTokenState } from "@/store/slices/userSlice";
import { loadData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const params = {
        url: endpoints.User,
        // setLoading: setIsSubmitting,
        // payload: { user: data.user, password: data.password },
        // isConsole: true,
        // isToast: true,
      };

      const tokenData = await loadData(params);
      if (tokenData?.data) {
        dispatch(setToken(tokenData.data as UserTokenState));
      }
    })();
  }, [dispatch]);

  return (
    <div className=" ">
      <HomeScreen />
    </div>
  );
}
