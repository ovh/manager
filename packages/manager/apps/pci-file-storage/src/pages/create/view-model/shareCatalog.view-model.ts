import {
  TAvailabilityZoneData,
  TContinentData,
  TDeploymentModeData,
  TDeploymentModeDataForCard,
  TMicroRegionData,
  TProvisionedPerformanceData,
  TRegionData,
  TShareSpecData,
} from '@/adapters/catalog/left/shareCatalog.data';
import {
  mapDeploymentModeForCard,
  mapRegionToLocalizationCard,
  mapShareSpecsToShareSpecData,
} from '@/adapters/catalog/left/shareCatalog.mapper';
import { TMacroRegion, TShareCatalog } from '@/domain/entities/catalog.entity';
import { getMicroRegions, isMicroRegionAvailable } from '@/domain/services/catalog.service';

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
