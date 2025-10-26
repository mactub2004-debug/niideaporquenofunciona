'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Barcode, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { motion } from 'framer-motion';

export default function ScanPage() {
  const [randomProductId, setRandomProductId] = useState<string | null>(null);

  useEffect(() => {
    // This runs only on the client, after the component has mounted.
    const randomProduct = ALL_PRODUCTS[Math.floor(Math.random() * ALL_PRODUCTS.length)];
    setRandomProductId(randomProduct.id);
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <motion.div 
      className="flex flex-col gap-8 h-full justify-center items-center"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
    >
      <PageHeader title="Scan a Product" subtitle="Center the barcode in the frame to scan."/>

      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-64 h-64 rounded-lg bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Camera View Here</p>
        </div>
        <Button size="lg" className="h-16 w-full max-w-xs rounded-full text-lg shadow-lg" asChild disabled={!randomProductId}>
          {randomProductId ? (
            <Link href={`/products/${randomProductId}`}>
              <Barcode className="mr-2 h-6 w-6" />
              Simulate Scan
            </Link>
          ) : (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Loading...
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
