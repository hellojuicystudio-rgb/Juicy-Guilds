import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    cpus: 1,
    webpackBuildWorker: false,
  },
  transpilePackages: ["@juicy-guilds/contracts", "@juicy-guilds/db", "@juicy-guilds/studio-engine"],
};

export default config;
