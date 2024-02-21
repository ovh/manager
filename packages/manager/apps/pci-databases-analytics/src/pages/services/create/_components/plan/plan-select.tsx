import PlanTile from './plan-tile';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';

interface PlansSelectProps {
  model: AvailabilitiesHookOutput;
  showMonthlyPrice?: boolean;
}

const PlansSelect = ({ model, showMonthlyPrice = false }: PlansSelectProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {model.listPlans
        .sort((a, b) => a.order - b.order)
        .map((plan) => (
          <PlanTile
            showMonthlyPrice={showMonthlyPrice}
            key={plan.name}
            plan={plan}
            selected={model.plan === plan.name}
            onChange={(value: string) => model.setPlan(value)}
          />
        ))}
    </div>
  );
};

export default PlansSelect;
