import { NAMESPACES } from '@ovh-ux/manager-common-translations';

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

type ContinentOption = {
  labelKey: string;
  continentCode: TCreateClusterSchema['location']['continent'];
};

export const selectContinentOptions = (): Array<ContinentOption> => {
  return createClusterFormContinentCodes.map((code) => ({
    labelKey: `common_continent_label_${code}`,
    continentCode: code,
  }));
};

type PlanOption = {
  labelKey: string;
  plan: TCreateClusterSchema['location']['plan'];
};

export const selectPlanOptions = (): Array<PlanOption> => {
  return [
    { labelKey: 'kubernetes_add_region_plan_all', plan: 'all' },
    { labelKey: 'kube_add_plan_title_standard', plan: 'standard' },
    { labelKey: 'kube_add_plan_title_free', plan: 'free' },
  ];
};

export const selectMacroRegions = (regions?: TRegions) => {
  return regions ? [...regions.entities.macroRegions.byId.values()] : undefined;
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

export const filterMacroRegions =
  (
    continent: TCreateClusterSchema['location']['continent'],
    plan: TCreateClusterSchema['location']['plan'],
    deploymentMode: TCreateClusterSchema['location']['deploymentMode'],
  ) =>
  (regions?: Array<TMacroRegion>) => {
    if (!regions) return undefined;

    return regions.filter((region) => {
      const regionDeploymentMode = region.plans.map(mapPlanCodeToDeploymentMode);
      const isDeploymentModeAllowed = regionDeploymentMode.includes(deploymentMode);

      const regionViewPlans = region.plans.map(mapPlanCodeToViewPlan);
      const isPlanAllowed = plan === 'all' || !plan || regionViewPlans.includes(plan);

      const isContinentAllowed = continent === 'ALL' || region.continentCode === continent;

      return isContinentAllowed && isPlanAllowed && isDeploymentModeAllowed;
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
    };
  });
