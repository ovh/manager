import { useCallback, useMemo } from 'react';

import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, RadioGroup, Spinner, Text } from '@ovhcloud/ods-react';

import { useCatalog } from '@ovh-ux/manager-pci-common';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { cn } from '@/helpers';
import { DeploymentMode, TClusterPlan, TClusterPlanCodeEnum, TClusterPlanEnum } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { selectPlansFromCatalog } from '../view-models/selectPlansFromCatalog';
import { PlanTileContent } from './plan/PlanContent.component';
import { PlanTileFooter } from './plan/PlanFooter.component';
import { PlanTileHeader } from './plan/PlanHeader.component';
import { PlanHelper } from './plan/PlanHelper.component';

type TPlanTileProps<T extends FieldValues> = {
  fieldName: Path<T>;
  planCodes: TClusterPlanCodeEnum[];
};

export const ClusterPlanSection = ({
  fieldName,
  planCodes,
}: TPlanTileProps<TCreateClusterSchema>) => {
  const type = DeploymentMode.MULTI_ZONES;

  const { getValues, setValue } = useFormContext();
  const planSelected = getValues(fieldName);

  const { t } = useTranslation(['add', 'kube']);

  const plans = useMemo(() => selectPlansFromCatalog(planCodes), [planCodes]);

  const planIsDisabled = (actualPlan: TClusterPlan) => actualPlan !== planSelected;

  const getSortOrder = useCallback(
    (typeRegion: string) => {
      const priority = {
        [DeploymentMode.MULTI_ZONES]: TClusterPlanEnum.STANDARD,
        [DeploymentMode.MONO_ZONE]: TClusterPlanEnum.FREE,
      };
      return priority[type as keyof typeof priority]
        ? (a: { value: string }) =>
            a.value === priority[typeRegion as keyof typeof priority] ? -1 : 1
        : () => 0;
    },
    [type],
  );

  const sortedPlans = useMemo(
    () => [...plans].sort(getSortOrder(type)),
    [plans, getSortOrder, type],
  );

  const pciCardClassName = (value: TClusterPlan) =>
    cn('h-full', {
      'hover:shadow-sm   cursor-pointer': !planIsDisabled(value),
      ' text-neutral-800 border-[--ods-color-border-readonly-default]': planIsDisabled(value),
    });

  const handleSelect = (value: TClusterPlan) => {
    if (planIsDisabled(value) || value === planSelected) return;

    return setValue(fieldName, value);
  };

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

        <div>
          {
            <RadioGroup value={planSelected}>
              <div className="my-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {sortedPlans.map((plan) => (
                  <PciCard
                    selectable
                    disabled={planIsDisabled(plan.value)}
                    selected={planSelected === plan.value}
                    key={plan.title}
                    onClick={() => handleSelect(plan.value)}
                    className={pciCardClassName(plan.value)}
                  >
                    {plan.title && (
                      <PlanTileHeader
                        value={plan.value}
                        selected={planSelected === plan.value}
                        title={plan.title}
                        description={plan.description}
                        disabled={planIsDisabled(plan.value)}
                        mode={plan.type}
                      />
                    )}
                    <div className="px-6 py-2">
                      <Divider />
                    </div>

                    <div className="flex flex-col gap-3 px-6 py-4 text-sm">
                      <PlanTileContent
                        disabled={planIsDisabled(plan.value)}
                        contents={plan.content}
                      />
                    </div>
                    <PlanTileFooter
                      isFreePlan={plan.value === TClusterPlanEnum.FREE}
                      disabled={planIsDisabled(plan.value)}
                      price={plan.price}
                      content={`kube_add_plan_footer_${plan.value}`}
                    />
                  </PciCard>
                ))}
              </div>
            </RadioGroup>
          }
        </div>
      </div>
    </article>
  );
};
