'use client';

import { useUserData } from '@/contexts/user-data-provider';
import { Button } from '@/components/ui/button';
import { List, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AddToListButton({ productId }: { productId: string }) {
  const { user, toggleShoppingListItem } = useUserData();
  const { toast } = useToast();
  
  if (!user) {
    return null; // Don't show button if logged out
  }

  const isInList = user.shoppingList.includes(productId);

  const handleClick = () => {
    toggleShoppingListItem(productId);
    toast({
        title: isInList ? "Removed from list" : "Added to list",
        description: isInList ? "The product has been removed from your shopping list." : "The product has been added to your shopping list.",
    });
  };

  return (
    <Button onClick={handleClick} variant={isInList ? 'default' : 'secondary'} className="w-full">
      {isInList ? <Check className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
      {isInList ? 'Added to List' : 'Add to Shopping List'}
    </Button>
  );
}
