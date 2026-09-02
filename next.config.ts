import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2j6dbq0eux0bg.cloudfront.net",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
