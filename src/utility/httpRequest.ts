import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const AUTH_API_BASE = "/api";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export const api = axios.create({
  baseURL: AUTH_API_BASE,
  headers: { "Content-Type": "application/json" },

  withCredentials: true,
});

interface loadDataParams {
  url: string;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  accessToken?: string;
  isToast?: boolean;
}

interface postDataParams {
  url: string;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  payload: unknown;
  isConsole?: boolean;
  isToast?: boolean;
  accessToken?: string;
}

interface putDataParams {
  url: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  payload: unknown;
  isConsole?: boolean;
  isToast?: boolean;
  accessToken?: string;
}

interface deleteDataParams {
  url?: string;
  payload?: unknown;
  accessToken?: string;
  isToast?: boolean;
}

export async function loadData(
  params: loadDataParams,
): Promise<AxiosResponse | undefined> {
  try {
    if (params.setLoading) {
      params.setLoading(true);
    }
    const res = await api.get(`${params.url}`, {
      baseURL: AUTH_API_BASE,
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error, "error");
    if (params.isToast) {
      if (isAxiosError(error)) {
        toast(error.response?.data?.message || error.message);
      } else {
        toast(getErrorMessage(error));
      }
    }
    return undefined;
  } finally {
    if (params.setLoading) {
      params.setLoading(false);
    }
  }
}

export async function postData(
  params: postDataParams,
): Promise<AxiosResponse | undefined> {
  try {
    if (params.setLoading) {
      params.setLoading(true);
    }
    const res = await api.post(`${params.url}`, params.payload, {
      baseURL: AUTH_API_BASE,
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });

    if (res.status === 201 || res.status === 200) {
      if (params.isToast) {
        toast(res.data.message);
      }
      return res;
    }
  } catch (error) {
    console.log(error, "error");
    if (params.isToast) {
      if (isAxiosError(error)) {
        toast(error.response?.data?.message || error.message);
      } else {
        toast(getErrorMessage(error));
      }
    }
    return undefined;
  } finally {
    if (params.setLoading) {
      params.setLoading(false);
    }
  }
}

export async function putData(
  params: putDataParams,
): Promise<AxiosResponse | undefined> {
  try {
    params.setLoading(true);
    const res = await api.put(`${params.url}`, params.payload, {
      baseURL: AUTH_API_BASE,
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    if (res.status === 200) {
      if (params.isToast) {
        toast(res.data.message);
      }
      return res;
    }
  } catch (error) {
    console.log(error, "error");
    if (params.isToast) {
      if (isAxiosError(error)) {
        toast(error.response?.data?.message || error.message);
      } else {
        toast(getErrorMessage(error));
      }
    }
    return undefined;
  } finally {
    params.setLoading(false);
  }
}

export async function deleteData(
  params: deleteDataParams,
): Promise<AxiosResponse | AxiosError | undefined> {
  try {
    const res = await api.delete(`${params.url}`, {
      baseURL: AUTH_API_BASE,
      data: params.payload,
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });

    if (res.status === 200) {
      if (params.isToast) {
        toast(res.data.message);
      }
      return res;
    }
  } catch (error) {
    console.log(error, "error");
    if (params.isToast) {
      toast(getErrorMessage(error));
    }
    return undefined;
  }
}
