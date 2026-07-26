import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/rebel-clan",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
