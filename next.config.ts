import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
