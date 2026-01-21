import { TDeploymentMode, TMacroRegion, TPlanCode } from '@/domain/entities/regions';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

export type TViewPlan = 'free' | 'standard';

export type PlanOption = {
  labelKey: string;
  plan: TCreateClusterSchema['location']['plan'];
};

export const mapPlanCodeToViewPlan = (planCode: TPlanCode): TViewPlan => {
  return planCode === 'mks.free.hour.consumption' || planCode === 'mks.free.hour.consumption.3az'
    ? 'free'
    : 'standard';
};

export const mapPlanCodeToDeploymentMode = (planCode: TPlanCode): TDeploymentMode => {
  return planCode === 'mks.standard.hour.consumption.3az' ||
    planCode === 'mks.free.hour.consumption.3az'
    ? 'region-3-az'
    : 'region';
};

const ALL_PLAN_OPTION: PlanOption = {
  labelKey: 'kubernetes_add_region_plan_all',
  plan: 'all',
};

export const selectAvailablePlanOptions = (regions?: Array<TMacroRegion>): Array<PlanOption> => {
  if (!regions || regions.length === 0) {
    return [ALL_PLAN_OPTION];
  }

  const uniquePlans = new Set<TViewPlan>();
  regions.forEach((region) => {
    const regionViewPlans = region.plans.map(mapPlanCodeToViewPlan);
    regionViewPlans.forEach((plan) => uniquePlans.add(plan));
  });

  const options = [...uniquePlans].map((plan) => ({
    labelKey: plan === 'standard' ? 'kube_add_plan_title_standard' : 'kube_add_plan_title_free',
    plan: plan,
  }));

  return [ALL_PLAN_OPTION, ...options];
};
