import React from 'react';
import { Plan } from '@/types/orderFunnel';
import PlanTile from './PlanTile.component';
import { cn } from '@/lib/utils';

interface PlansSelectProps {
  plans: Plan[];
  value: string;
  onChange: (newPlan: string) => void;
  showMonthlyPrice?: boolean;
  className?: string;
}

const PlansSelect = React.forwardRef<HTMLInputElement, PlansSelectProps>(
  ({ plans, value, onChange, showMonthlyPrice = false, className }, ref) => {
    return (
      <div
        data-testid="plans-select-container"
        ref={ref}
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2',
          className,
        )}
      >
        {plans.map((plan) => (
          <PlanTile
            showMonthlyPrice={showMonthlyPrice}
            key={plan.name}
            plan={plan}
            selected={value === plan.name}
            onChange={(newValue: string) => onChange(newValue)}
          />
        ))}
      </div>
    );
  },
);
PlansSelect.displayName = 'PlansSelect';
export default PlansSelect;
