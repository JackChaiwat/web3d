import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/web3d",
        assetPrefix: "/web3d",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
