import { setToken, UserTokenState } from "@/store/slices/userSlice";
import { api } from "@/utility/httpRequest";
import { toast } from "sonner";
import { useAppDispatch } from "./useAppStore";

const useRefreshToken = () => {
  const dispatch = useAppDispatch();
  const refreshToken = async () => {
    try {
      const response = await api.get(`/login/refresh-token`);
      if (!response) {
        await api.get(`/logout`);

        toast("Session Expired, Please login again");
        dispatch(setToken({} as UserTokenState));
        // setTimeout(() => {
        //   window.location.href = "/login";
        // }, 2000);
        return;
      }
      dispatch(setToken(response.data));
      return response.data.access_token;
    } catch (error) {
      console.log(error, "Refresh token invalid or expired.");
      return;
    }
  };
  return refreshToken;
};
export default useRefreshToken;
