import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          // You can add these as well
          // port: '',
          // pathname: 'arifscloud/image/upload/**',
        },
      ],
    },
}