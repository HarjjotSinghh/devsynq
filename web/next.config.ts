import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Allow importing shared code from the root electron package (e.g. Icons)
    externalDir: true,
  },
};

export default nextConfig;
