import { useCallback } from 'react';

import { useCatalog } from '@ovh-ux/manager-pci-common';

import { DeploymentMode, TClusterPlan, TClusterPlanEnum } from '@/types';

type TPlan = {
  title: string;
  type: DeploymentMode;
  description: string;
  content: string[];
  footer?: string;
  value: TClusterPlan;
  code: string | null;
  price: number | null;
};

enum TClusterCodePlanEnum {
  FREE = 'mks.free.hour.consumption',
  STANDARD = 'mks.standard.hour.consumption',
  STANDARD3AZ = 'mks.standard.hour.consumption.3az',
  FREE3AZ = 'mks.free.hour.consumption.3az',
}

const usePlanData = (
  codes: string[], isMutiZone: boolean = false,
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
        'kube_add_plan_content_free_high_availability',
        'kube_add_plan_content_free_SLO',
        'kube_add_plan_content_free_auto_scaling',
        'kube_add_plan_content_free_ETCD',
        'kube_add_plan_content_free_version',
        'kube_add_plan_content_free_100',
      ],
      value: TClusterPlanEnum.FREE,
      type: DeploymentMode.MONO_ZONE,
      code: codes.includes(TClusterCodePlanEnum.FREE) ? isMutiZone ? TClusterCodePlanEnum.FREE3AZ : TClusterCodePlanEnum.FREE : null,
    },
    {
      title: 'kube_add_plan_title_standard',
      description: 'kube_add_plan_description_standard',
      content: [
        'kube_add_plan_content_standard_3AZ_control_plane',
        'kube_add_plan_content_standard_disponibility',
        'kube_add_plan_content_standard_SLA',
        'kube_add_plan_content_free_auto_scaling',
        'kube_add_plan_content_standard_ETCD',
        'kube_add_plan_content_standard_version',
        'kube_add_plan_content_standard_500',
      ],
      type: DeploymentMode.MULTI_ZONES,
      value: TClusterPlanEnum.STANDARD,
      code: codes.includes(TClusterCodePlanEnum.STANDARD) ? (isMutiZone ? TClusterCodePlanEnum.STANDARD3AZ : TClusterCodePlanEnum.STANDARD) : null,
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
