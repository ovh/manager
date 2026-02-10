import { Divider } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';

import { TCreateClusterSchema } from '../../CreateClusterForm.schema';
import { TPlanTile } from '../../view-models/plans.viewmodel';
import { PlanTileContent } from './PlanContent.component';
import { PlanTileFooter } from './PlanFooter.component';
import { PlanTileHeader } from './PlanHeader.component';

type TPlanTypeCardProps = {
  plan: TPlanTile;
  selectedPlanType: TCreateClusterSchema['planType'] | null;
  isMultiZone: boolean;
  onSelect: (planType: string | null) => void;
};

export const PlanTypeCard = ({
  plan,
  selectedPlanType,
  isMultiZone,
  onSelect,
}: TPlanTypeCardProps) => {
  return (
    <PciCard
      selectable={!plan.disabled}
      disabled={plan.disabled}
      selected={selectedPlanType === plan.planType}
      onClick={() => onSelect(plan.planType)}
    >
      {plan.title && (
        <PlanTileHeader
          value={plan.planType}
          title={plan.title}
          description={plan.description}
          disabled={plan.disabled}
          isMultiZone={isMultiZone}
        />
      )}
      <Divider className="w-full" />
      <PlanTileContent disabled={plan.disabled} contents={plan.content} />
      <PlanTileFooter
        isFreePlan={plan.planType === 'free'}
        disabled={plan.disabled}
        priceExclVat={plan.price?.priceExclVat ?? null}
        priceInclVat={plan.price?.priceInclVat ?? null}
        content={`kube_add_plan_footer_${plan.planType}`}
      />
    </PciCard>
  );
};
