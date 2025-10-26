'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  ChevronRight,
  History,
  Heart,
  Settings,
  Globe,
  Languages,
  LogOut,
} from 'lucide-react';
import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [value]);

  return <motion.p className="text-2xl font-bold">{displayValue}</motion.p>;
}


export default function ProfilePage() {
  const { user, logout, language, toggleLanguage } = useUserData();
  const router = useRouter();

  if (!user) {
    // This should be handled by the layout, but as a fallback
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Placeholder data for new features
  const stats = {
    scans: user.scanHistory.length,
    healthScore: 85, // Placeholder
    favorites: 12, // Placeholder
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </header>

      {/* User Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-around text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>United States</span>
            </div>
            <Button variant="ghost" onClick={toggleLanguage} className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>{language === 'en' ? 'English' : 'Español'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action List */}
      <div className="flex flex-col gap-2">
        <ActionItem
          href="/history"
          icon={History}
          title="Scan History"
          subtitle="View all your scanned products"
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
        />
        <ActionItem
          href="/profile/favorites"
          icon={Heart}
          title="Favorite Products"
          subtitle="View your saved products"
          iconColor="text-red-500"
          bgColor="bg-red-50"
        />
        <ActionItem
          href="/profile/settings"
          icon={Settings}
          title="Settings & Preferences"
          subtitle="Manage allergies, diet, and app settings"
          iconColor="text-green-500"
          bgColor="bg-green-50"
        />
      </div>

      {/* Stats Card */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Your Stats</h3>
        <Card>
          <CardContent className="p-4 flex justify-around text-center">
            <div>
              <AnimatedNumber value={stats.scans} />
              <p className="text-sm text-muted-foreground">Scans</p>
            </div>
            <div>
              <AnimatedNumber value={stats.healthScore} />
              <p className="text-sm text-muted-foreground">Health Score</p>
            </div>
            <div>
              <AnimatedNumber value={stats.favorites} />
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sign Out Button */}
      <Button variant="ghost" className="text-muted-foreground justify-center" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}

function ActionItem({ href, icon: Icon, title, subtitle, iconColor, bgColor }: {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:bg-secondary/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
