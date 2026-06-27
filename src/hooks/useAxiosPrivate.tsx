import { RootState } from "@/store/store";
import { api } from "@/utility/httpRequest";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const prevRequest = error?.config;
          if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(prevRequest);
          }
        } catch (e) {
          console.log(e, "axios private error");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refresh]);

  return api;
};

export default useAxiosPrivate;
