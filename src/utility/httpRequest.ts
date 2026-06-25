import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import axios from "axios";

const AUTH_API_BASE = "/api";

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
  payload: any;
  isConsole?: boolean;
  isToast?: boolean;
  accessToken?: string;
}

interface putDataParams {
  url: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  payload: any;
  isConsole?: boolean;
  isToast?: boolean;
  accessToken?: string;
}

interface deleteDataParams {
  url?: string;
  payload?: any;
  accessToken?: string;
  isToast?: boolean;
}

export async function loadData(params: loadDataParams) {
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
    if (error instanceof Error) {
      if (params.isToast) {
        toast(error.message);
      }
    }
    return undefined;
  } finally {
    if (params.setLoading) {
      params.setLoading(false);
    }
  }
}

export async function postData(params: postDataParams) {
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
      return res as any;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (params.isToast) {
        toast(error.message);
      }
      return error.message;
    }
  } finally {
    if (params.setLoading) {
      params.setLoading(false);
    }
  }
}

export async function putData(params: putDataParams) {
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
      return res as any;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (params.isToast) {
        toast(error.message);
      }
      return error.message;
    }
  } finally {
    params.setLoading(false);
  }
}

export async function deleteData(params: deleteDataParams) {
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
      return res as any;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (params.isToast) {
        toast(error.message);
      }
      return error.message;
    }
  }
}
