'use client';

import { useUserData } from '@/contexts/user-data-provider';
import { AVAILABLE_HEALTH_GOALS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HealthGoalsManager() {
  const { user, setHealthGoal } = useUserData();
  const userHealthGoals = user?.healthGoals || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      {AVAILABLE_HEALTH_GOALS.map(goal => {
        const isSelected = userHealthGoals.includes(goal.id);
        return (
        <Button
          key={goal.id}
          variant="outline"
          onClick={() => user && setHealthGoal(goal.id)}
          disabled={!user}
          className={cn(
            "h-auto justify-start p-4 rounded-lg flex items-center gap-3",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        )}
        >
          <goal.icon className="h-6 w-6" />
          <span className="font-semibold flex-1 text-left">{goal.name}</span>
        </Button>
      )}
      )}
    </div>
  );
}
