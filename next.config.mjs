/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hackclub.com",
      },
      {
        protocol: "https",
        hostname: "user-cdn.hackclub-assets.com",
      },
    ],
  },
};

export default nextConfig;