import { TPlanCode } from '@/domain/entities/cloudCatalog';
import { TDeploymentMode, TMacroRegion } from '@/domain/entities/regions';
import { TClusterPlanEnum } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { filterMacroRegions } from './regions.viewmodel';

export type TViewPlan = 'free' | 'standard';

export type PlanOption = {
  labelKey: string;
  plan: TCreateClusterSchema['location']['plan'];
};

export const mapPlanCodeToViewPlan = (planCode: TPlanCode): TViewPlan => {
  return planCode === 'mks.free.hour.consumption' ? 'free' : 'standard';
};

export const mapPlanCodeToDeploymentMode = (planCode: TPlanCode): TDeploymentMode => {
  return planCode === 'mks.standard.hour.consumption.3az' ? 'region-3-az' : 'region';
};

const ALL_PLAN_OPTION: PlanOption = {
  labelKey: 'kubernetes_add_region_plan_all',
  plan: TClusterPlanEnum.ALL,
};

export const selectAvailablePlanOptions =
  (continentField: TCreateClusterSchema['location']['continent']) =>
  (regions?: Array<TMacroRegion>): Array<PlanOption> => {
    if (!regions || regions.length === 0) {
      return [ALL_PLAN_OPTION];
    }

    const filteredRegions = filterMacroRegions(continentField, TClusterPlanEnum.ALL)(regions);

    const uniquePlans = new Set<TViewPlan>();
    filteredRegions?.forEach((region) => {
      const regionViewPlans = region.plans.map(mapPlanCodeToViewPlan);
      regionViewPlans.forEach((plan) => uniquePlans.add(plan));
    });

    const options = [...uniquePlans].map((plan) => ({
      labelKey: plan === 'standard' ? 'kube_add_plan_title_standard' : 'kube_add_plan_title_free',
      plan: plan === 'standard' ? TClusterPlanEnum.STANDARD : TClusterPlanEnum.FREE,
    }));

    return [ALL_PLAN_OPTION, ...options];
  };
