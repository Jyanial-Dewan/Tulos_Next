import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
