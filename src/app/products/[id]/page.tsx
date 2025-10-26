'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ChevronLeft, Info, List, Leaf, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SuitabilityBadge from '@/components/products/suitability-badge';
import AiSummarySection from '@/components/products/ai-summary-section';
import AddToListButton from '@/components/products/add-to-list-button';
import ProductCard from '@/components/products/product-card';
import { getSuitability } from '@/lib/utils';
import { useUserData } from '@/contexts/user-data-provider';
import { useEffect } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { user, addScanToHistory } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      addScanToHistory(params.id);
    }
  }, [user, params.id, addScanToHistory]);

  if (!user) {
      // This is a protected route, so we shouldn't get here without a user.
      // But as a fallback, we can redirect.
      // In a real app, this logic would be in middleware or a layout effect.
      if (typeof window !== 'undefined') {
          router.replace('/login');
      }
      return null;
  }
  
  const product = ALL_PRODUCTS.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const detectedUserAllergens = product.allergens.filter(allergen => user.allergies.includes(allergen));
  const suitability = getSuitability(product, user.allergies);

  const healthierAlternatives = ALL_PRODUCTS.filter(p => p.suitability === 'recommended' && p.id !== product.id).slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col bg-card sm:bg-background">
      <header className="flex items-center p-4 border-b bg-card sm:bg-transparent sm:border-none">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/scan">
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold mx-auto pr-10 truncate">{product.name}</h1>
      </header>
      
      <div className="p-0 sm:p-4">
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="relative w-full h-64">
             <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.imageHint}
            />
            <div className="absolute top-4 right-4">
              <SuitabilityBadge suitability={suitability} />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map(tag => <Badge key={tag} variant="secondary" className="capitalize">{tag.replace('_', ' ')}</Badge>)}
              </div>
            </div>

            <div className="flex items-center gap-2">
                <AddToListButton productId={product.id} />
            </div>
            
            <AiSummarySection product={product} />

            {detectedUserAllergens.length > 0 && (
              <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Flame className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-destructive">Potential Allergen Alert</h3>
                      <div className="mt-1 text-sm text-destructive/80">
                        <p>This product may contain <span className="font-semibold capitalize">{detectedUserAllergens.join(', ')}</span>, which you're allergic to.</p>
                      </div>
                    </div>
                  </div>
              </div>
            )}

            <Accordion type="single" collapsible defaultValue="ingredients">
              <AccordionItem value="ingredients">
                <AccordionTrigger><Leaf className="mr-2 h-4 w-4 text-primary" />Ingredients</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{product.ingredients}</p>
                   <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-sm">Contains:</h4>
                    {product.allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {product.allergens.map(a => <Badge key={a} variant="outline" className="capitalize">{a}</Badge>)}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No common allergens listed.</p>
                    )}
                   </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="nutrition">
                <AccordionTrigger><Info className="mr-2 h-4 w-4 text-primary" />Nutritional Information</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-4">Servings per package: {product.nutritionalInformation.servingsPerPackage} | Serving size: {product.nutritionalInformation.servingSize}</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-semibold py-2">Metric</th>
                        <th className="text-right font-semibold py-2">Per Serving</th>
                        <th className="text-right font-semibold py-2">Per 100g</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.nutritionalInformation.metrics.map(metric => (
                        <tr key={metric.name} className="border-b last:border-none">
                          <td className="py-2 font-medium">{metric.name}</td>
                          <td className="text-right py-2 text-muted-foreground">{metric.perServing}</td>
                          <td className="text-right py-2 text-muted-foreground">{metric.per100g}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {healthierAlternatives.length > 0 && (
              <div>
                <Separator className="my-6" />
                <h3 className="text-lg font-semibold mb-4 flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary"/>Healthier Alternatives</h3>
                <div className="grid grid-cols-1 gap-4">
                    {healthierAlternatives.map(altProduct => (
                         <Link href={`/products/${altProduct.id}`} key={altProduct.id} className="block">
                            <ProductCard product={altProduct} />
                         </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
