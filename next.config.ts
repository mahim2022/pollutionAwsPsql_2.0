import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   allowedDevOrigins: [
    "http://localhost:3000",       // local development
    "http://127.0.0.1:3000",       // alternative localhost
    "http://98.85.288.29:3000"      // if testing from EC2 or LAN
  ],
};

export default nextConfig;
