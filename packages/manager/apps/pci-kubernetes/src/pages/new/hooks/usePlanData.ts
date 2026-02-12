import { useCallback } from 'react';

import { useCatalog } from '@ovh-ux/manager-pci-common';

import { TClusterPlanEnum, TPlan } from '@/types';

const usePlanData = (
  codes: string[],
  isMutiZone: boolean = false,
): { plans: TPlan[]; isPending: boolean } => {
  const { data: catalog, isPending: isPendingCatalog } = useCatalog();

  const pricing = useCallback(
    (code: string) => {
      if (catalog) {
        const getAddon = catalog.addons.find((add) => add.planCode === code);

        return getAddon?.pricings[0]?.price ?? null;
      }
      return null;
    },
    [catalog],
  );

  const plans: TPlan[] = [
    {
      title: 'kube_add_plan_title_free',
      description: 'kube_add_plan_description_free',
      content: [
        'kube_add_plan_content_free_control',
        'kube_add_plan_content_free_high_availability_1AZ',
        'kube_add_plan_content_free_SLO',
        'kube_add_plan_content_free_auto_scaling',
        'kube_add_plan_content_free_ETCD',
        'kube_add_plan_content_free_version',
        'kube_add_plan_content_free_100',
      ],
      value: TClusterPlanEnum.FREE,
      code: codes.find((code) => code.includes(TClusterPlanEnum.FREE)) ?? null,
    },
    {
      title: 'kube_add_plan_title_standard',
      description: 'kube_add_plan_description_standard',
      content: [
        ...(isMutiZone
          ? [
              'kube_add_plan_content_standard_3AZ_control_plane',
              'kube_add_plan_content_standard_disponibility_3AZ',
              'kube_add_plan_content_standard_3AZ_SLA',
            ]
          : [
              'kube_add_plan_content_standard_1AZ_control_plane',
              'kube_add_plan_content_standard_1AZ_SLA',
            ]),
        'kube_add_plan_content_free_auto_scaling',
        'kube_add_plan_content_standard_ETCD',
        'kube_add_plan_content_standard_version',
        'kube_add_plan_content_standard_500',
      ],
      value: TClusterPlanEnum.STANDARD,
      code: codes.find((code) => code.includes(TClusterPlanEnum.STANDARD)) ?? null,
    },
  ].map((plan) => ({
    ...plan,
    price: plan.code ? pricing(plan.code) : null,
  }));

  return {
    isPending: isPendingCatalog,
    plans,
  };
};

export default usePlanData;
