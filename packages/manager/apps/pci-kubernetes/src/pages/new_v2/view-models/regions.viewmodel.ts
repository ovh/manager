import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { TKubeRegions } from '@/domain/entities/kubeRegion';
import { TCountryCode, TMacroRegion, TRegions } from '@/domain/entities/regions';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { TViewPlan, mapPlanCodeToDeploymentMode, mapPlanCodeToViewPlan } from './plans.viewmodel';

export type TRegionCard = {
  labelKey: string;
  id: string;
  microRegions: string[];
  disabled: boolean;
  country: TCountryCode | null;
  plans: Array<TViewPlan>;
  continentCode: TCreateClusterSchema['location']['continent'];
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
