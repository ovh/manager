import { Deps, TTranslateFn } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TRegion } from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { getLocalZoneTranslationKey } from '@/utils';

export type TRegionDataForCard = {
  city: string;
  region: string;
  deploymentMode: TDeploymentMode;
  countryCode: TCountryIsoCode | null;
};

const mapRegionToLocalizationCard = (translate: TTranslateFn) => (
  region: TRegion,
): TRegionDataForCard => {
  const regionName =
    region.deploymentMode === 'localzone'
      ? getLocalZoneTranslationKey(region.name)
      : region.name;
  return {
    city: translate(`regions:manager_components_region_${regionName}`),
    region: region.name,
    countryCode: region.country,
    deploymentMode: region.deploymentMode,
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
  const { translate, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const regionsIds =
    continentId === 'all'
      ? data.entities.regions.allIds
      : data.entities.continents.byId.get(continentId)?.datacenterIds;

  if (!regionsIds) return [];

  const matchingContinentAndDeploymentModeRegions = regionsIds.reduce(
    (acc, regionId): TRegion[] => {
      const foundRegion = data.entities.regions.byId.get(regionId);
      if (!foundRegion) return acc;
      if (
        !deploymentModes.length ||
        deploymentModes.includes(foundRegion.deploymentMode)
      )
        acc.push(foundRegion);
      return acc;
    },
    [] as TRegion[],
  );

  return matchingContinentAndDeploymentModeRegions.map(
    mapRegionToLocalizationCard(translate),
  );
};
