import {
  TContinentData,
  TDeploymentModeData,
  TDeploymentModeDataForCard,
  TRegionData,
} from '@/adapters/catalog/left/shareCatalog.data';
import {
  mapDeploymentModeForCard,
  mapRegionToLocalizationCard,
} from '@/adapters/catalog/left/shareCatalog.mapper';
import { TMacroRegion, TShareCatalog } from '@/domain/entities/catalog.entity';

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

export const selectContinent =
  (deploymentModes: TDeploymentModeData[]) =>
  (data?: TShareCatalog): TContinentData[] => {
    if (!data) return [];

    const continentsIds = deploymentModes.length
      ? [
          ...new Set(
            deploymentModes.flatMap(
              (mode) => data.relations.continentIdsByDeploymentModeId.get(mode) ?? [],
            ),
          ),
          'all',
        ]
      : ['all', ...data.entities.continents.allIds];

    return continentsIds.map((continent) => ({
      labelKey: `localisation.continents.options.${continent}`,
      value: continent,
    }));
  };
