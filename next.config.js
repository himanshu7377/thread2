/** @type {import('next').NextConfig} */
const nextConfig = {

    typescript:{
      ignoreBuildErrors:true,
    },
    experimental: {
        serverActions: {
          dev: true, // Set to true if you want to enable server actions in development
        },
        serverComponentsExternalPackages: ["mongoose"],
      },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
        {
          protocol: "https",
          hostname: "images.clerk.dev",
        },
        {
          protocol: "https",
          hostname: "uploadthing.com",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
        },
      ],
    
    },
  };
  
  module.exports = nextConfig;