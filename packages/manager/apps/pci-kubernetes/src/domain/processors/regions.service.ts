import { TKubeRegions } from '../entities/kubeRegion';
import { TMacroRegion, TRegions } from '../entities/regions';

export const selectMacroRegions = (regions?: TRegions) => {
  return regions ? [...regions.entities.macroRegions.byId.values()] : undefined;
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
