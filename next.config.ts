import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // photos of handwritten answers are posted to a server action for marking;
    // they are downscaled on the client first, but 1 MB is too tight for a
    // full A4 sheet shot on a phone
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
