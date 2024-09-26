import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import PlanComponent from '@/components/Plan.component';
import { TRegistryPlan } from '@/api/data/registry';

export type TPlanChooserProps = {
  plan: TRegistryPlan;
  plans: TRegistryPlan[];
  onInput: (value: TRegistryPlan) => void;
};

export default function PlanChooser({
  plan,
  plans,
  onInput,
}: Readonly<TPlanChooserProps>): JSX.Element {
  return (
    <TilesInputComponent<TRegistryPlan>
      items={plans || []}
      value={plan}
      onInput={(v) => {
        onInput(v);
      }}
      label={(item) => <PlanComponent plan={item} />}
      tileClass={{ active: 'p-0', inactive: 'p-0' }}
    />
  );
}
