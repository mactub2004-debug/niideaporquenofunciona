/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Para onboarding y MOCK_USER
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Para placeholder-images.json
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Mantén el resto de tu configuración si existe
};

export default nextConfig;