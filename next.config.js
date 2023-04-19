/** @type {import('next').NextConfig} */

const BASE_API_URL = process.env.BASE_API_URL || "localhost:8088";

const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    }); // 针对 SVG 的处理规则

    return config;
  },
  output: 'standalone',
  images: {
    domains: ["mp.weixin.qq.com"],
  },
  async rewrites () {
    return [
      {
        source: '/hehe/:path*',
        destination: `https://${BASE_API_URL}/api/:path*`,
      },
    ]
  },
};


module.exports = nextConfig;
