import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolate browser-test output from a developer's running local server.
  distDir: process.env.CAREFLOW_BUILD_DIR || ".next",
};

export default nextConfig;
