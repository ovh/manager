import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TRegion } from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';
// import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export type TRegionDataForCard = {
  city: string;
  region: string;
  countryCode: string;
  deploymentMode: TDeploymentMode;
};

// TODO: Remove || ''
const mapRegionToLocalizationCard = (translate: Deps['translate']) => (
  region: TRegion,
): TRegionDataForCard => ({
  city: translate(`region:manager_components_region_${region.name}`),
  region: region.name,
  countryCode: region.country || '',
  deploymentMode: region.deploymentMode,
});

type TSelectLocalizationsForCard = (
  projectId: string,
  deploymentMode: TDeploymentMode[],
  continentId: string,
) => TRegionDataForCard[];

export const selectLocalizations: Reader<Deps, TSelectLocalizationsForCard> = (
  deps,
) => (
  projectId: string,
  deploymentMode: TDeploymentMode[],
  continentId: string,
): TRegionDataForCard[] => {
  const { translate, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const continentRegionIds = data.entities.continents.byId.get(continentId)
    ?.datacenterIds;

  if (!continentRegionIds) return [];

  const matchingContinentAndDeploymentModeRegions = continentRegionIds.reduce(
    (acc, regionId): TRegion[] => {
      const foundRegion = data.entities.regions.byId.get(regionId);
      if (!foundRegion) return acc;
      if (deploymentMode.includes(foundRegion.deploymentMode))
        acc.push(foundRegion);
      return acc;
    },
    [] as TRegion[],
  );

  return matchingContinentAndDeploymentModeRegions.map(
    mapRegionToLocalizationCard(translate),
  );
};
