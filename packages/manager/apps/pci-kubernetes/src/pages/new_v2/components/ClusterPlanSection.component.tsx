import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, RadioGroup, Text } from '@ovhcloud/ods-react';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { useCloudCatalog } from '@/api/hooks/useCloudCatalog';
import { PciCard } from '@/components/pciCard/PciCard.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import {
  TPlanTile,
  selectPlansFromCatalog,
  selectRegionPlanType,
} from '../view-models/selectPlansFromCatalog';
import { PlanTileContent } from './plan/PlanContent.component';
import { PlanTileFooter } from './plan/PlanFooter.component';
import { PlanTileHeader } from './plan/PlanHeader.component';
import { PlanHelper } from './plan/PlanHelper.component';

export const ClusterPlanSection = () => {
  const { setValue, control } = useFormContext<TCreateClusterSchema>();
  const [selectedPlanType, deploymentMode, macroRegion] = useWatch({
    control,
    name: ['planType', 'location.deploymentMode', 'location.macroRegion'],
  });
  const isMultiZone = deploymentMode === 'region-3-az';

  const { t } = useTranslation(['add', 'kube']);

  const { data: plans } = useCloudCatalog({ select: selectPlansFromCatalog(isMultiZone) });
  const { data: regionPlanTypes } = useAvailabilityRegions({
    select: selectRegionPlanType(macroRegion ?? ''),
  });

  const handleSelect = (value: TPlanTile['planType']) => {
    if (value === selectedPlanType) return;

    return setValue('planType', value);
  };

  /* 
    TODO : 
    - Mettre 'isDisabled' dans le view model -> one data hook ?
    - Extraire dans un composant PlanTile ?
    - Ajouter un Controller pour fixer la sélection
    - Mettre à jour le prix dans le cart
    - Refacto ou commentaire pour la magie noire dans le PlanTileFooter
    - Ajouter des tests dans les mappers
  */

  return (
    <article>
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">{t('kube:kube_service_cluster_plan')}</Text>
        <PlanHelper />
      </div>

      <div>
        <Text className="my-4  block" color="text">
          {t('kube_add_plan_subtitle')}
        </Text>

        <RadioGroup value={selectedPlanType}>
          <div className="my-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {plans?.map((plan) => {
              // A mettre dans le view model
              const isDisabled = !regionPlanTypes?.includes(plan.planType);

              return (
                <PciCard
                  selectable={!isDisabled}
                  disabled={isDisabled}
                  selected={selectedPlanType === plan.planType}
                  key={plan.title}
                  onClick={() => handleSelect(plan.planType)}
                >
                  {plan.title && (
                    <PlanTileHeader
                      value={plan.code}
                      selected={selectedPlanType === plan.planType}
                      title={plan.title}
                      description={plan.description}
                      disabled={isDisabled}
                      isMultiZone={isMultiZone}
                    />
                  )}
                  <Divider className="w-full" />
                  <PlanTileContent disabled={isDisabled} contents={plan.content} />
                  <PlanTileFooter
                    isFreePlan={plan.planType === 'free'}
                    disabled={isDisabled}
                    priceExclVat={plan.price?.priceExclVat ?? null}
                    priceInclVat={plan.price?.priceInclVat ?? null}
                    content={`kube_add_plan_footer_${plan.planType}`}
                  />
                </PciCard>
              );
            })}
          </div>
        </RadioGroup>
      </div>
    </article>
  );
};
