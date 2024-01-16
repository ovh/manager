import PlanTile from './plan-tile';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';

interface PlansSelectProps {
  model: AvailabilitiesHookOutput;
}

const PlansSelect = ({ model }: PlansSelectProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {model.listPlans.map((plan) => (
        <PlanTile
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
