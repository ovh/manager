import { useEffect } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RadioGroup, Text } from '@ovhcloud/ods-react';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { usePlanTiles } from '../view-models/plans.viemodel';
import { PlanHelper } from './plan/PlanHelper.component';
import { PlanTypeCard } from './plan/PlanTypeCard.component';

export const ClusterPlanSection = () => {
  const { setValue, control } = useFormContext<TCreateClusterSchema>();
  const [selectedPlanType, deploymentMode, macroRegion] = useWatch({
    control,
    name: ['planType', 'location.deploymentMode', 'location.macroRegion'],
  });
  const isMultiZone = deploymentMode === 'region-3-az';

  const { t } = useTranslation(['add', 'kube']);

  const { plans } = usePlanTiles(macroRegion ?? '', isMultiZone);

  const handleSelect = (value: string | null) => {
    if (!value || value === selectedPlanType) return;

    const selectedPlanTile = plans?.find((plan) => plan.planType === value);
    if (selectedPlanTile?.disabled) return;

    const planType = value as TCreateClusterSchema['planType'];

    return setValue('planType', planType);
  };

  useEffect(() => {
    if (!plans) return;

    const availablePlans = plans.filter((plan) => plan.disabled === false);
    const sortedPlans = availablePlans.sort((a, b) => {
      if (a.planType === 'standard' && b.planType !== 'standard') return -1;
      if (a.planType !== 'standard' && b.planType === 'standard') return 1;
      return 0;
    });

    const firstPlan = sortedPlans[0];
    if (!firstPlan) return;

    setValue('planType', firstPlan.planType);
  }, [plans, setValue]);

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

        <Controller
          name="planType"
          control={control}
          render={() => (
            <RadioGroup
              name="planType"
              value={selectedPlanType}
              onValueChange={({ value }) => handleSelect(value)}
            >
              <div className="my-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {plans?.map((plan) => (
                  <PlanTypeCard
                    key={plan.title}
                    plan={plan}
                    selectedPlanType={selectedPlanType}
                    isMultiZone={isMultiZone}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </article>
  );
};
