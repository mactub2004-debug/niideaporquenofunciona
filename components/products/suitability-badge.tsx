import { Badge } from '@/components/ui/badge';
import type { Suitability } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SuitabilityBadgeProps {
  suitability: Suitability;
  size?: 'default' | 'sm';
}

const suitabilityConfig = {
  recommended: {
    label: 'Recommended',
    className: 'bg-primary/90 hover:bg-primary/90 text-primary-foreground',
  },
  caution: {
    label: 'Use with Caution',
    className: 'bg-warning hover:bg-warning text-warning-foreground',
  },
  not_recommended: {
    label: 'Not Recommended',
    className: 'bg-destructive hover:bg-destructive text-destructive-foreground',
  },
};

const SuitabilityBadge = ({ suitability, size = 'default' }: SuitabilityBadgeProps) => {
  const config = suitabilityConfig[suitability];
  return (
    <Badge className={cn('border-transparent', config.className, size === 'sm' && 'px-2 py-0.5 text-xs')}>
      {config.label}
    </Badge>
  );
};

export default SuitabilityBadge;
