import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TMicroRegion, TMacroRegion } from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { getLocalZoneTranslationKey } from '@/utils';

type TMicroRegionDataForCard = {
  name: string;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
};

export type TRegionData = {
  cityKey: string;
  datacenterDetails: string | null;
  macroRegion: string | null;
  microRegion: string | null;
  deploymentMode: TDeploymentMode;
  countryCode: TCountryIsoCode | null;
  microRegions: TMicroRegionDataForCard[];
};

export const getRegionNameKey = (
  deploymentMode: TDeploymentMode,
  name: string,
) => (deploymentMode === 'localzone' ? getLocalZoneTranslationKey(name) : name);

const getMicroRegionName = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) => {
  if (!region.microRegions[0]) return null;
  return microRegionsById.get(region.microRegions[0])?.name ?? null;
};

const getDatacenterDetails = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) =>
  region.microRegions.length > 1
    ? region.name
    : getMicroRegionName(region, microRegionsById);

const getMicroRegions = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) =>
  region.microRegions.flatMap((regionId) => {
    const microRegion = microRegionsById.get(regionId);
    return microRegion
      ? [
          {
            name: microRegion.name,
            availabilityZones: microRegion.availabilityZones,
            isActivable: microRegion.isActivable,
            isInMaintenance: microRegion.isInMaintenance,
          },
        ]
      : [];
  });

const mapRegionToLocalizationCard = (
  microRegionsById: Map<string, TMicroRegion>,
) => (region: TMacroRegion): TRegionData => {
  const regionName = getRegionNameKey(region.deploymentMode, region.name);

  return {
    cityKey: `manager_components_region_${regionName}`,
    datacenterDetails: getDatacenterDetails(region, microRegionsById),
    macroRegion: region.name,
    microRegion: getMicroRegionName(region, microRegionsById),
    countryCode: region.country,
    deploymentMode: region.deploymentMode,
    microRegions: getMicroRegions(region, microRegionsById),
  };
};

export type TRegionDataForCard = {
  localizations: TRegionData[];
};

type TSelectLocalizationsData = (
  projectId: string,
  deploymentMode: TDeploymentMode[],
  continentId: string,
  selectedMacroRegionId: string | null,
) => TRegionDataForCard;

const emptyLocalizations = {
  localizations: [],
};

export const selectLocalizations: Reader<Deps, TSelectLocalizationsData> = (
  deps,
) => (projectId, deploymentModes, continentId) => {
  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return emptyLocalizations;

  const macroRegionsIds =
    continentId === 'all'
      ? data.entities.macroRegions.allIds
      : data.entities.continents.byId.get(continentId)?.datacenterIds;

  if (!macroRegionsIds) return emptyLocalizations;

  const matchingContinentAndDeploymentModeRegions = macroRegionsIds.reduce(
    (acc, macroRegionId): TMacroRegion[] => {
      const foundMacroRegion = data.entities.macroRegions.byId.get(
        macroRegionId,
      );
      if (!foundMacroRegion) return acc;
      if (
        !deploymentModes.length ||
        deploymentModes.includes(foundMacroRegion.deploymentMode)
      )
        acc.push(foundMacroRegion);
      return acc;
    },
    [] as TMacroRegion[],
  );

  const localizations = matchingContinentAndDeploymentModeRegions.map(
    mapRegionToLocalizationCard(data.entities.microRegions.byId),
  );

  return {
    localizations,
  };
};
