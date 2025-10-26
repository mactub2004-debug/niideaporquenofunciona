import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import SuitabilityBadge from './suitability-badge';
import { ChevronRight } from 'lucide-react';
import { getSuitability } from '@/lib/utils';
import { useUserData } from '@/contexts/user-data-provider';


type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useUserData();
  // In a real app, user would come from context or session
  const suitability = getSuitability(product, user?.allergies || []);

  return (
    <Card className="hover:bg-secondary/50 transition-colors">
      <CardContent className="p-4 flex items-center gap-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={64}
          height={64}
          className="rounded-lg bg-muted border"
          data-ai-hint={product.imageHint}
        />
        <div className="flex-1">
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <div className="mt-2">
            <SuitabilityBadge suitability={suitability} size="sm" />
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
