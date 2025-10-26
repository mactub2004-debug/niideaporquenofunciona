// src/app/layout.tsx
'use client';

import './globals.css';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserDataProvider, useUserData } from '@/contexts/user-data-provider';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/common/bottom-nav';
import { Loader2 } from 'lucide-react';

const AUTH_ROUTES = ['/login', '/signup', '/onboarding'];

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserData();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return; // No hacer nada mientras carga
    }
    
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
    
    if (!user && !isAuthRoute) {
      // Usuario no logueado Y no está en una página de auth -> redirigir a onboarding
      router.replace('/onboarding');
    }
    
    if (user && isAuthRoute) {
      // Usuario logueado Y está en una página de auth -> redirigir a la app
      router.replace('/');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    // Muestra el spinner DE ALTO NIVEL mientras se determina el estado de auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const showNav = !isAuthRoute && !!user;
  
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-28 px-6 pt-6">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>HealthScan Pro</title>
        <meta name="description" content="Scan, understand, and choose healthier products." />
      </head>
      <body className="font-body antialiased bg-background">
        <UserDataProvider>
          <AppContent>
            {children}
          </AppContent>
          <Toaster />
        </UserDataProvider>
      </body>
    </html>
  );
}