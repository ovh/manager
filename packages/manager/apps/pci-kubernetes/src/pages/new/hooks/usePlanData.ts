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
  code: string;
  price: number | null;
};

const usePlanData = (): { plans: TPlan[]; isPending: boolean } => {
  const { data: catalog, isPending: isPendingCatalog } = useCatalog();

  const pricing = useCallback(
    (code: string) => {
      if (catalog) {
        const getAddon = catalog.addons.find((add) => add.planCode === code);

        return getAddon?.pricings[0].price ?? null;
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
      code: 'mks.free.hour.consumption',
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
      code: 'mks.standard.hour.consumption.3az',
    },
  ].map((plan) => ({
    ...plan,
    price: pricing(plan.code),
  }));

  return {
    isPending: isPendingCatalog,
    plans,
  };
};

export default usePlanData;
