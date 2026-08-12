import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'ec2-44-203-183-202.compute-1.amazonaws.com',
    '44.203.183.202',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;