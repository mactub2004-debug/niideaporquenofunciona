'use client';

import Link from 'next/link';
import { useUserData } from '@/contexts/user-data-provider';
import { ALL_PRODUCTS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PageHeader from '@/components/common/page-header';
import { ShoppingBasket, Trash2 } from 'lucide-react';

export default function ListPage() {
  const { user, toggleShoppingListItem, clearShoppingList } = useUserData();
  
  if (!user) {
    return null;
  }
  
  const shoppingListProducts = ALL_PRODUCTS.filter(p => user.shoppingList.includes(p.id));

  return (
    <>
      <PageHeader title="Shopping List" />
      {shoppingListProducts.length > 0 ? (
        <div className="space-y-4 mt-8">
          <div className="flex justify-end">
             <Button variant="ghost" size="sm" onClick={clearShoppingList} className="text-muted-foreground">
                <Trash2 className="mr-2 h-4 w-4"/>
                Clear List
            </Button>
          </div>
          <ul className="space-y-3">
            {shoppingListProducts.map(product => (
              <li key={product.id} className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm">
                <Checkbox
                  id={`item-${product.id}`}
                  checked={false} 
                  className="h-5 w-5"
                />
                <label htmlFor={`item-${product.id}`} className="flex-1">
                  <Link href={`/products/${product.id}`}>
                    <span className="font-medium block cursor-pointer">{product.name}</span>
                    <span className="text-sm text-muted-foreground cursor-pointer">{product.brand}</span>
                  </Link>
                </label>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toggleShoppingListItem(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center">
            <ShoppingBasket className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold">Your shopping list is empty</h3>
          <p className="text-muted-foreground mt-2">Add products to your list from the product pages.</p>
        </div>
      )}
    </>
  );
}
