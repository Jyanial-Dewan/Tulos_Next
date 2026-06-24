const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  if (config?.params) {
    Object.entries(config.params).forEach(([k, v]) =>
      url.searchParams.append(k, v),
    );
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }

  return res.json();
}

export const http = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>("GET", path, undefined, config),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>("POST", path, body, config),
  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>("PUT", path, body, config),
  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>("DELETE", path, undefined, config),
};
