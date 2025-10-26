/** @type {import('next').NextConfig} */
const nextConfig = {
  // Añade o modifica la sección 'images' así:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // Permite cualquier ruta dentro de picsum.photos
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Añadido para las imágenes de Unsplash
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Asegúrate de mantener el resto de tu configuración si existe
};

export default nextConfig;