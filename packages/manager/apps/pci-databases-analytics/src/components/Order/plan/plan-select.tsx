import React from 'react';
import { Plan } from '@/models/order-funnel';
import PlanTile from './plan-tile';

interface PlansSelectProps {
  plans: Plan[];
  value: string;
  onChange: (newPlan: string) => void;
  showMonthlyPrice?: boolean;
}

const PlansSelect = React.forwardRef<HTMLInputElement, PlansSelectProps>(
  ({ plans, value, onChange, showMonthlyPrice = false }, ref) => {
    return (
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
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
