'use client';

import { useUserData } from '@/contexts/user-data-provider';
import { AVAILABLE_ALLERGENS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AllergenManager() {
  const { user, toggleAllergy } = useUserData();
  const userAllergies = user?.allergies || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      {AVAILABLE_ALLERGENS.map(allergen => {
        const isSelected = userAllergies.includes(allergen.id);
        return (
          <Button
            key={allergen.id}
            variant="outline"
            onClick={() => user && toggleAllergy(allergen.id)}
            disabled={!user}
            className={cn(
                "h-auto justify-start p-4 rounded-lg flex items-center gap-3",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            )}
          >
            <allergen.icon className="h-6 w-6" />
            <span className="font-semibold flex-1 text-left">{allergen.name}</span>
          </Button>
        )
      })}
    </div>
  );
}
