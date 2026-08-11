import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'ec2-18-234-143-10.compute-1.amazonaws.com',
    '18.234.143.10',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;