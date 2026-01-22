import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { useKubeRegions } from '@/api/hooks/useKubeRegions';
import { TKubeRegions } from '@/domain/entities/kubeRegion';
import { TCountryCode, TMacroRegion, TRegions } from '@/domain/entities/regions';
import {
  filterMacroRegionsByKubeRegions,
  selectMacroRegions,
} from '@/domain/services/regions.service';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { TViewPlan, mapPlanCodeToDeploymentMode, mapPlanCodeToViewPlan } from './plans.viewmodel';

export type TRegionCard = {
  labelKey: string;
  id: string;
  microRegions: string[];
  country: TCountryCode | null;
  plans: Array<TViewPlan>;
  continentCode: TCreateClusterSchema['location']['continent'];
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

const DEFAULT_EU_3AZ_MACRO_REGION_ID = 'PAR';
const DEFAULT_EU_1AZ_MACRO_REGION_ID = 'RBX';
const DEFAULT_US_MACRO_REGION_ID = 'VA';
export const findDefaultMacroRegion =
  (is3azAvailable: boolean, deploymentMode: TCreateClusterSchema['location']['deploymentMode']) =>
  (regions?: Array<TRegionCard>): TRegionCard | undefined => {
    const fallbackRegion = regions?.at(0);

    // US case
    if (!is3azAvailable) {
      return regions?.find((region) => region.id === DEFAULT_US_MACRO_REGION_ID) ?? fallbackRegion;
    }

    // EU 1AZ case
    if (deploymentMode === 'region') {
      return (
        regions?.find((region) => region.id === DEFAULT_EU_1AZ_MACRO_REGION_ID) ?? fallbackRegion
      );
    }

    // EU 3AZ case
    if (deploymentMode === 'region-3-az') {
      return (
        regions?.find((region) => region.id === DEFAULT_EU_3AZ_MACRO_REGION_ID) ?? fallbackRegion
      );
    }

    return fallbackRegion;
  };

const DEFAULT_EU_3AZ_MICRO_REGION_ID = 'eu-west-par';
const DEFAULT_EU_1AZ_MICRO_REGION_ID = 'RBX-A';
const DEFAULT_US_MICRO_REGION_ID = 'VA1';
export const findDefaultMicroRegion =
  (is3azAvailable: boolean, deploymentMode: TCreateClusterSchema['location']['deploymentMode']) =>
  (regions?: Array<string>): string | undefined => {
    const fallbackRegion = regions?.at(0);

    // US case
    if (!is3azAvailable) {
      return regions?.find((region) => region === DEFAULT_US_MICRO_REGION_ID) ?? fallbackRegion;
    }

    // EU 1AZ case
    if (deploymentMode === 'region') {
      return regions?.find((region) => region === DEFAULT_EU_1AZ_MICRO_REGION_ID) ?? fallbackRegion;
    }

    // EU 3AZ case
    if (deploymentMode === 'region-3-az') {
      return regions?.find((region) => region === DEFAULT_EU_3AZ_MICRO_REGION_ID) ?? fallbackRegion;
    }

    return fallbackRegion;
  };

export const useCombinedRegions = (
  deploymentMode: TCreateClusterSchema['location']['deploymentMode'],
) => {
  const { data: kubeRegions } = useKubeRegions();

  const { data: regions } = useAvailabilityRegions({
    select: selectAvailableRegions(deploymentMode, kubeRegions),
  });

  return {
    regions,
  };
};
