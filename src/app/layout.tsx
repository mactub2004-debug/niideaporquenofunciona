'use client';

import './globals.css';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserDataProvider, useUserData } from '@/contexts/user-data-provider';
import { Toaster } from '@/components/ui/toaster'; // <-- Descomentado
import BottomNav from '@/components/common/bottom-nav'; // <-- Descomentado
import { Loader2 } from 'lucide-react';

const AUTH_ROUTES = ['/login', '/signup', '/onboarding'];

function AppContent({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUserData();
  const router = useRouter();
  const pathname = usePathname();

  // --- useEffect SIGUE COMENTADO POR AHORA ---
  /*
  useEffect(() => {
    // ... (lógica comentada) ...
  }, [user, isLoading, pathname, router]);
  */
  // --- FIN useEffect ---

  if (isLoading) {
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
      {console.log("Rendering AppContent - User:", !!user, "Path:", pathname)}
      <main className="flex-1 pb-28 px-6 pt-6">{children}</main>
      {showNav && <BottomNav />} {/* <-- Descomentado */}
    </div>
  );
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
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
          <AppContent>{children}</AppContent>
          <Toaster /> {/* <-- Descomentado */}
        </UserDataProvider>
      </body>
    </html>
  );
}