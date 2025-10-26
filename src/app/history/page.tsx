'use client';

import Link from 'next/link';
import { useUserData } from '@/contexts/user-data-provider';
import { ALL_PRODUCTS } from '@/lib/data';
import PageHeader from '@/components/common/page-header';
import ProductCard from '@/components/products/product-card';
import { History as HistoryIcon } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const { user } = useUserData();

  if (!user) {
      return null;
  }

  const scanHistoryProducts = user.scanHistory
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="-ml-4">
          <Link href="/profile">
            <ChevronLeft />
          </Link>
        </Button>
        <PageHeader title="Scan History" />
      </div>

      {scanHistoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {scanHistoryProducts.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center">
            <HistoryIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold">No scan history yet</h3>
          <p className="text-muted-foreground mt-2">Your scanned products will appear here.</p>
        </div>
      )}
    </>
  );
}
