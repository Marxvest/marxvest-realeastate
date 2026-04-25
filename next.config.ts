import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "marxvestspec.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/listing",
        destination: "/listings",
        permanent: true,
      },
      {
        source: "/property",
        destination: "/listings",
        permanent: true,
      },
      {
        source: "/properties",
        destination: "/listings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
