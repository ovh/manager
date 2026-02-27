import { ComponentType, SVGProps } from 'react';

import { TCountryIsoCode } from '@/components/new-lib/flag/country-iso-code';
import {
  TDeploymentMode,
  TMacroRegion,
  TMicroRegion,
  TShareCatalog,
  TShareSpecs,
} from '@/domain/entities/catalog.entity';
import {
  getMicroRegions,
  isMacroRegionAvailable,
  isMicroRegionAvailable,
  provisionedPerformanceCalculator,
} from '@/domain/services/catalog.service';

import Region1azImage from '../../../../public/assets/1AZ.svg';
import Region3azImage from '../../../../public/assets/3AZ.svg';
import LZImage from '../../../../public/assets/LZ.svg';

export type TSVGImage = ComponentType<SVGProps<SVGSVGElement>>;

export type TDeploymentModeData = 'region' | 'localzone' | 'region-3-az';

export type TDeploymentModeDataForCard = {
  mode: TDeploymentModeData;
  labelKey: string;
  descriptionKey: string;
  Image: TSVGImage;
};

export type TRegionData = {
  cityKey: string;
  datacenterDetails: string | null;
  macroRegion: string | null;
  deploymentMode: TDeploymentModeData;
  countryCode: TCountryIsoCode | null;
  available: boolean;
  firstAvailableMicroRegion: string | undefined;
};

export type TContinentData = { labelKey: string; value: string };

export type TMicroRegionData = { label: string; value: string; disabled: boolean };

export type TAvailabilityZoneData = { label: string; value: string };

export type TProvisionedPerformanceData = {
  iops: number;
  throughput: number;
};

export type TShareSpecData = {
  name: string;
  capacityMin: number;
  capacityMax: number;
  iopsLevel: number;
  bandwidthLevel: number;
  bandwidthUnit: string;
  calculateProvisionedPerformance: (shareSize: number) => TProvisionedPerformanceData | null;
};

const getImage = (mode: TDeploymentMode) => {
  switch (mode) {
    case 'region-3-az':
      return Region3azImage;
    case 'region':
      return Region1azImage;
    default:
      return LZImage;
  }
};

const mapDeploymentModeForCard = (mode: TDeploymentMode): TDeploymentModeDataForCard => ({
  mode,
  labelKey: `localisation.deploymentMode.modes.${mode}.label`,
  descriptionKey: `localisation.deploymentMode.modes.${mode}.description`,
  Image: getImage(mode) as unknown as TSVGImage,
});

const getLocalZoneTranslationKey = (regionName: string) => regionName.split('-').slice(-1)[0];

const getRegionNameKey = (deploymentMode: TDeploymentMode, name: string) =>
  deploymentMode === 'localzone' ? getLocalZoneTranslationKey(name) : name;

const getMicroRegionName = (region: TMacroRegion, microRegionsById: Map<string, TMicroRegion>) => {
  const firstId = region.microRegions?.[0];
  if (!firstId) return null;
  return microRegionsById.get(firstId)?.name ?? null;
};

const getFirstAvailableMicroRegion = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
): string | undefined => {
  const microRegions = getMicroRegions(region, microRegionsById);
  const firstAvailable = microRegions.find(isMicroRegionAvailable);
  return firstAvailable?.name;
};

const getDatacenterDetails = (region: TMacroRegion, microRegionsById: Map<string, TMicroRegion>) =>
  (region.microRegions?.length ?? 0) > 1
    ? region.name
    : getMicroRegionName(region, microRegionsById);

const mapRegionToLocalizationCard =
  (microRegionsById: Map<string, TMicroRegion>) =>
  (region: TMacroRegion): TRegionData => {
    const regionName = getRegionNameKey(region.deploymentMode, region.name);

    return {
      cityKey: `manager_components_region_${regionName}`,
      datacenterDetails: getDatacenterDetails(region, microRegionsById),
      macroRegion: region.name,
      countryCode: region.country,
      deploymentMode: region.deploymentMode,
      available: isMacroRegionAvailable(region, microRegionsById),
      firstAvailableMicroRegion: getFirstAvailableMicroRegion(region, microRegionsById),
    };
  };

const mapShareSpecsToShareSpecData = (spec: TShareSpecs): TShareSpecData => {
  const calculateProvisionedPerformance = provisionedPerformanceCalculator(spec);

  return {
    name: spec.name,
    capacityMin: spec.capacity.min,
    capacityMax: spec.capacity.max,
    iopsLevel: spec.iops.level,
    bandwidthLevel: spec.bandwidth.level,
    bandwidthUnit: spec.bandwidth.unit,
    calculateProvisionedPerformance,
  };
};

export type TFirstAvailableLocation = { macroRegion: string; microRegion: string };

export const selectDeploymentModes = (data?: TShareCatalog): TDeploymentModeDataForCard[] =>
  (data?.entities?.deploymentModes?.allIds ?? []).map(mapDeploymentModeForCard);

export type SelectLocalizationsParams = {
  deploymentModes: TDeploymentModeData[];
  continentId: string;
};

export const selectLocalizations =
  ({ deploymentModes, continentId }: SelectLocalizationsParams) =>
  (data?: TShareCatalog): TRegionData[] => {
    if (!data) return [];

    const macroRegionsIds =
      continentId === 'all'
        ? data.entities.macroRegions.allIds
        : data.entities.continents.byId.get(continentId)?.macroRegionIds;

    if (!macroRegionsIds) return [];

    const matchingContinentAndDeploymentModeRegions = macroRegionsIds.reduce(
      (acc, macroRegionId): TMacroRegion[] => {
        const foundMacroRegion = data.entities.macroRegions.byId.get(macroRegionId);
        if (!foundMacroRegion) return acc;
        if (!deploymentModes.length || deploymentModes.includes(foundMacroRegion.deploymentMode))
          acc.push(foundMacroRegion);
        return acc;
      },
      [] as TMacroRegion[],
    );

    return matchingContinentAndDeploymentModeRegions.map(
      mapRegionToLocalizationCard(data.entities.microRegions.byId),
    );
  };

export const selectFirstAvailableLocation =
  ({ deploymentModes, continentId }: SelectLocalizationsParams) =>
  (data?: TShareCatalog): TFirstAvailableLocation | undefined => {
    const localizations = selectLocalizations({ deploymentModes, continentId })(data);
    const firstAvailable = localizations.find((loc) => loc.available);
    if (!firstAvailable?.macroRegion) return undefined;

    const macroRegion = data?.entities.macroRegions.byId.get(firstAvailable.macroRegion);
    if (!macroRegion) return { macroRegion: firstAvailable.macroRegion, microRegion: '' };

    const microRegions = getMicroRegions(macroRegion, data!.entities.microRegions.byId);
    const firstMicro = microRegions.find(isMicroRegionAvailable) ?? microRegions[0];

    return {
      macroRegion: firstAvailable.macroRegion,
      microRegion: firstMicro?.name ?? '',
    };
  };

export const selectContinent =
  (deploymentModes: TDeploymentModeData[]) =>
  (data?: TShareCatalog): TContinentData[] => {
    if (!data) return [];

    const continentsIds = deploymentModes.length
      ? [
          'all',
          ...new Set(
            deploymentModes.flatMap(
              (mode) => data.relations.continentIdsByDeploymentModeId.get(mode) ?? [],
            ),
          ),
        ]
      : ['all', ...data.entities.continents.allIds];

    return continentsIds.map((continent) => ({
      labelKey: `localisation.continents.options.${continent}`,
      value: continent,
    }));
  };

export const selectMicroRegions =
  (macroRegionId?: string) =>
  (data?: TShareCatalog): TMicroRegionData[] => {
    if (!data || !macroRegionId) return [];

    const macroRegion = data.entities.macroRegions.byId.get(macroRegionId);
    if (!macroRegion) return [];

    const microRegions = getMicroRegions(macroRegion, data.entities.microRegions.byId);

    return microRegions.map((microRegion) => ({
      label: microRegion.name,
      value: microRegion.name,
      disabled: !isMicroRegionAvailable(microRegion),
    }));
  };

export const selectAvailabilityZones =
  (microRegionName: string) =>
  (data?: TShareCatalog): TAvailabilityZoneData[] => {
    if (!data || !microRegionName) return [];

    const microRegion = data.entities.microRegions.byId.get(microRegionName);
    if (!microRegion) return [];

    return microRegion.availabilityZones.map((availabilityZone) => ({
      label: availabilityZone,
      value: availabilityZone,
    }));
  };

export const selectShareSpecs =
  (microRegionId?: string) =>
  (data?: TShareCatalog): TShareSpecData[] => {
    if (!data || !microRegionId) return [];

    return Array.from(data.entities.shareSpecs.byId.values())
      .filter((spec) => spec.microRegionIds.includes(microRegionId))
      .map(mapShareSpecsToShareSpecData);
  };

export const provisionedPerformancePresenter = ({
  iops,
  throughput,
}: TProvisionedPerformanceData) => {
  const formattedIOPS = Math.round(iops).toString();
  const formattedThroughput = (Math.round(throughput * 100) / 100).toFixed(1).replace('.0', '');

  return {
    iops: formattedIOPS,
    throughput: formattedThroughput,
  };
};
