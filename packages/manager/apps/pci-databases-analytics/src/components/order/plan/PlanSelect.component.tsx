import React from 'react';
import { RadioGroup } from '@datatr-ux/uxlib';
import { Plan } from '@/types/orderFunnel';
import PlanTile from './PlanTile.component';
import { cn } from '@/lib/utils';

interface PlansSelectProps {
  plans: Plan[];
  value: string;
  onChange: (newPlan: string) => void;
  className?: string;
}

const PlansSelect = React.forwardRef<HTMLInputElement, PlansSelectProps>(
  ({ plans, value, onChange, className }, ref) => {
    return (
      <RadioGroup
        data-testid="plans-select-container"
        onValueChange={onChange}
        value={value}
        ref={ref}
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2',
          className,
        )}
      >
        {plans.map((plan) => (
          <PlanTile key={plan.name} plan={plan} />
        ))}
      </RadioGroup>
    );
  },
);
PlansSelect.displayName = 'PlansSelect';
export default PlansSelect;
