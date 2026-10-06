import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Force cache bust 2026-10-06
  async redirects() {
    return [
      {
        source: "/how-it-works",
        destination: "/recruitment-process",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
