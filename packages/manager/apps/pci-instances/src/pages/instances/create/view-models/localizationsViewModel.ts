import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TMicroRegion, TMacroRegion } from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { getLocalZoneTranslationKey } from '@/utils';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';

type TMicroRegionDataForCard = {
  name: string;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
};

export type TRegionDataForCard = {
  city: string;
  region: string | null;
  deploymentMode: TDeploymentMode;
  countryCode: TCountryIsoCode | null;
  microRegions: TMicroRegionDataForCard[];
};

const getRegionName = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) => {
  if (!region.microRegions[0]) return null;
  return region.microRegions.length > 1
    ? region.name
    : microRegionsById.get(region.microRegions[0])?.name ?? null;
};

const mapRegionToLocalizationCard = (
  microRegionsById: Map<string, TMicroRegion>,

  getMessageFn: MessageProviderPort['getMessage'],
) => (region: TMacroRegion): TRegionDataForCard => {
  const regionName =
    region.deploymentMode === 'localzone'
      ? getLocalZoneTranslationKey(region.name)
      : region.name;

  return {
    city: getMessageFn(`regions:manager_components_region_${regionName}`),
    region: getRegionName(region, microRegionsById),
    countryCode: region.country,
    deploymentMode: region.deploymentMode,
    microRegions: region.microRegions.flatMap((regionId) => {
      const microRegion = microRegionsById.get(regionId);
      return microRegion ? [microRegion] : [];
    }),
  };
};
type TSelectLocalizationsForCard = (
  projectId: string,
  deploymentMode: TDeploymentMode[],
  continentId: string,
) => TRegionDataForCard[];

export const selectLocalizations: Reader<Deps, TSelectLocalizationsForCard> = (
  deps,
) => (
  projectId: string,
  deploymentModes: TDeploymentMode[],
  continentId: string,
): TRegionDataForCard[] => {
  const { messageProviderPort, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const macroRegionsIds =
    continentId === 'all'
      ? data.entities.macroRegions.allIds
      : data.entities.continents.byId.get(continentId)?.datacenterIds;

  if (!macroRegionsIds) return [];

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

  return matchingContinentAndDeploymentModeRegions.map(
    mapRegionToLocalizationCard(
      data.entities.microRegions.byId,
      messageProviderPort.getMessage,
    ),
  );
};
