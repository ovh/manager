import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import PlanComponent from '@/components/Plan.component';
import { TRegistryPlan } from '@/api/data/registry';
import { DeploymentMode } from '@/types';

export type TPlanChooserProps = {
  plan: TRegistryPlan;
  type: DeploymentMode;
  onInput: (value: TRegistryPlan) => void;
  plans?: TRegistryPlan[];
};

export default function PlanChooser({
  type,
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
      label={(item) => <PlanComponent type={type} plan={item} />}
    />
  );
}
