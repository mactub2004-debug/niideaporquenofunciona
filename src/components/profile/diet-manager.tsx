'use client';

import { useUserData } from '@/contexts/user-data-provider';
import { AVAILABLE_DIETS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DietManager() {
  const { user, toggleDiet } = useUserData();
  const userDiets = user?.diet || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      {AVAILABLE_DIETS.map(diet => {
        const isSelected = userDiets.includes(diet.id);
        return (
        <Button
          key={diet.id}
          variant="outline"
          onClick={() => user && toggleDiet(diet.id)}
          disabled={!user}
          className={cn(
            "h-auto justify-start p-4 rounded-lg flex items-center gap-3",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        )}
        >
          <diet.icon className="h-6 w-6" />
          <span className="font-semibold flex-1 text-left">{diet.name}</span>
        </Button>
      )})}
    </div>
  );
}
