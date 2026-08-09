import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    cpus: 1,
    webpackBuildWorker: false,
  },
  transpilePackages: ["@juicy-guilds/db"],
};

export default config;
