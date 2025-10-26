'use client';

import Link from 'next/link';
import PageHeader from '@/components/common/page-header';
import { Heart } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="-ml-4">
          <Link href="/profile">
            <ChevronLeft />
          </Link>
        </Button>
        <PageHeader title="Favorite Products" />
      </div>

      <div className="text-center py-20 flex flex-col items-center">
        <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold">No favorite products yet</h3>
        <p className="text-muted-foreground mt-2">Your saved products will appear here.</p>
      </div>
    </>
  );
}
