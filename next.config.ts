import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Make photos dropped into /public/images available to the server at runtime (Vercel).
  outputFileTracingIncludes: { "/": ["./public/images/**/*"] },
  async redirects() {
    return [
      { source: "/gallery", destination: "/#gallery", permanent: true },
      { source: "/wilpattu-national-park", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
