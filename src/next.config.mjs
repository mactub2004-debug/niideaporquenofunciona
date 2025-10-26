/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // NECESARIO
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Probablemente necesario también
        port: '',
        pathname: '/**',
      },
      // Agrega otros si los necesitas
    ],
  },
  // ...cualquier otra configuración que tengas...
};

export default nextConfig;