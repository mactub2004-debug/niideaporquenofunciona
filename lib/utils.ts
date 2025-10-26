import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product, Suitability } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getSuitability(product: Product, userAllergies: string[] = []): Suitability {
  const hasAllergen = product.allergens.some(allergen => userAllergies.includes(allergen));
  
  if (hasAllergen) {
    return 'not_recommended';
  }
  
  return product.suitability;
}
