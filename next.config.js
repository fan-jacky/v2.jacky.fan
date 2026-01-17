/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '',
  output: 'standalone',
  env: {
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJ_ID: process.env.APPWRITE_PROJ_ID,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
  reactStrictMode: true,
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.STRAPI_HOSTNAME || "localhost",
        port: process.env.STRAPI_PORT || "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
