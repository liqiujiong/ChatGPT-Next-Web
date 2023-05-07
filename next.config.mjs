/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites () {
    const BASE_API_URL = process.env.BASE_API_URL
    return {
      beforeFiles: [{
        source: '/hehe/:path*',
        destination: `https://${BASE_API_URL}/api/:path*`,
      }
      ],
    };
  },
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  output: "standalone",
  images: {
    domains: ["mp.weixin.qq.com"],
  },
};

export default nextConfig;
