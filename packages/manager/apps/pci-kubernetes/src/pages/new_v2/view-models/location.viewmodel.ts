import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { TKubeRegions } from '@/domain/entities/kubeRegion';
import {
  TCountryCode,
  TDeploymentMode,
  TMacroRegion,
  TPlanCode,
  TRegions,
} from '@/domain/entities/regions';

import { TCreateClusterSchema, createClusterFormContinentCodes } from '../CreateClusterForm.schema';

export type TViewPlan = 'free' | 'standard';

export type TRegionCard = {
  labelKey: string;
  id: string;
  microRegions: string[];
  disabled: boolean;
  country: TCountryCode | null;
  plans: Array<TViewPlan>;
};

export type ContinentOption = {
  labelKey: string;
  continentCode: TCreateClusterSchema['location']['continent'];
};

export type PlanOption = {
  labelKey: string;
  plan: TCreateClusterSchema['location']['plan'];
};

const mapPlanCodeToViewPlan = (planCode: TPlanCode): TViewPlan => {
  return planCode === 'mks.free.hour.consumption' || planCode === 'mks.free.hour.consumption.3az'
    ? 'free'
    : 'standard';
};

const mapPlanCodeToDeploymentMode = (planCode: TPlanCode): TDeploymentMode => {
  return planCode === 'mks.standard.hour.consumption.3az' ||
    planCode === 'mks.free.hour.consumption.3az'
    ? 'region-3-az'
    : 'region';
};

export const selectMacroRegions = (regions?: TRegions) => {
  return regions ? [...regions.entities.macroRegions.byId.values()] : undefined;
};

export const filterMacroRegionsByDeploymentMode =
  (deploymentMode: TCreateClusterSchema['location']['deploymentMode']) =>
  (regions?: Array<TMacroRegion>) => {
    if (!regions) return undefined;

    return regions.filter((region) => {
      const regionDeploymentMode = region.plans.map(mapPlanCodeToDeploymentMode);
      return regionDeploymentMode.includes(deploymentMode);
    });
  };

export const filterMacroRegionsByKubeRegions =
  (kubeRegions?: TKubeRegions) => (regions?: Array<TMacroRegion>) => {
    if (!regions) return undefined;
    if (!kubeRegions) return regions;

    return regions
      .map((region) => ({
        ...region,
        microRegionIds: region.microRegionIds.filter((microRegionId) =>
          kubeRegions.includes(microRegionId),
        ),
      }))
      .filter((region) => region.microRegionIds.length > 0);
  };

export const filterMacroRegions =
  (
    continent: TCreateClusterSchema['location']['continent'],
    plan: TCreateClusterSchema['location']['plan'],
  ) =>
  (regions?: Array<TMacroRegion>) => {
    if (!regions) return undefined;

    return regions.filter((region) => {
      const regionViewPlans = region.plans.map(mapPlanCodeToViewPlan);
      const isPlanAllowed = plan === 'all' || !plan || regionViewPlans.includes(plan);

      const isContinentAllowed = continent === 'ALL' || region.continentCode === continent;

      return isContinentAllowed && isPlanAllowed;
    });
  };

export const mapMacroRegionForCards = (regions?: TMacroRegion[]): TRegionCard[] | undefined =>
  regions?.map((region) => {
    // Custom case for Mumbai region until common-translations is updated
    const regionKey = region.name === 'YNM' ? 'MUM' : region.name;

    return {
      labelKey: `${NAMESPACES.REGION}:region_${regionKey}`,
      id: region.name,
      microRegions: region.microRegionIds,
      disabled: !region.enabled,
      country: region.countryCode,
      plans: region.plans.map(mapPlanCodeToViewPlan),
      continentCode: region.continentCode,
    };
  });

const ALL_CONTINENT_OPTION: ContinentOption = {
  labelKey: 'common_continent_label_ALL',
  continentCode: 'ALL',
};

export const selectAvailableContinentOptions = (
  regions?: Array<TMacroRegion>,
): Array<ContinentOption> => {
  if (!regions || regions.length === 0) {
    return [ALL_CONTINENT_OPTION];
  }

  const uniqueContinents = new Set(regions.map((region) => region.continentCode));

  const options: Array<ContinentOption> = [ALL_CONTINENT_OPTION];

  createClusterFormContinentCodes.forEach((code) => {
    if (code !== 'ALL' && uniqueContinents.has(code)) {
      options.push({
        labelKey: `common_continent_label_${code}`,
        continentCode: code,
      });
    }
  });

  return options;
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

export const selectAvailableRegions =
  (
    deploymentMode: TCreateClusterSchema['location']['deploymentMode'],
    kubeRegions?: TKubeRegions,
  ) =>
  (regions?: TRegions) => {
    const macroRegions = selectMacroRegions(regions);
    const filteredRegionsByKubeRegions = filterMacroRegionsByKubeRegions(kubeRegions)(macroRegions);
    const filteredByDeploymentMode = filterMacroRegionsByDeploymentMode(deploymentMode)(
      filteredRegionsByKubeRegions,
    );
    return filteredByDeploymentMode;
  };

export const selectAre3azRegionsAvailable = (regions?: TRegions): boolean => {
  const hasFree3azRegions =
    !!regions?.relations.planRegions['mks.free.hour.consumption.3az']?.length;
  const hasStandard3azRegions =
    !!regions?.relations.planRegions['mks.standard.hour.consumption.3az']?.length;

  return hasFree3azRegions || hasStandard3azRegions;
};
