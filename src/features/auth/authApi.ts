import type { LoginRequest, RegisterRequest, AuthResponse } from "./authTypes";

const AUTH_API_BASE = "/api";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Login failed" }));
    throw new Error(err.message ?? "Login failed");
  }
  return res.json();
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Registration failed" }));
    throw new Error(err.message ?? "Registration failed");
  }
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(AUTH_API_BASE, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
