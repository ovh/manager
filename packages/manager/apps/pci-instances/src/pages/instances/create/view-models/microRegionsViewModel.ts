import { Deps } from '@/deps/deps';
import {
  TInstancesCatalog,
  TMicroRegion,
} from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';

export type TMicroRegionData = {
  label: string;
  value: string;
  disabled: boolean;
};

type TSelectMicroRegionData = (
  projectId: string,
  regionId: string | null,
) => TMicroRegionData[] | null;

const mapMicroRegion = (foundMicroRegion: TMicroRegion) => ({
  label: foundMicroRegion.name,
  value: foundMicroRegion.name,
  disabled: !foundMicroRegion.isActivable || foundMicroRegion.isInMaintenance,
});

const createMicroRegions = (data: TInstancesCatalog, id: string) => {
  const { macroRegions, microRegions } = data.entities;

  const isMacroRegion = macroRegions.allIds.includes(id);

  if (isMacroRegion) {
    const foundMacroRegion = macroRegions.byId.get(id);
    if (!foundMacroRegion) return [];

    return foundMacroRegion.microRegions.flatMap((microRegion) => {
      const foundMicroRegion = microRegions.byId.get(microRegion);
      return foundMicroRegion ? mapMicroRegion(foundMicroRegion) : [];
    });
  } else {
    const foundMicroRegion = microRegions.byId.get(id);
    return foundMicroRegion ? [mapMicroRegion(foundMicroRegion)] : [];
  }
};

export const selectMicroRegions: Reader<Deps, TSelectMicroRegionData> = (
  deps,
) => (projectId, id) => {
  if (!id) return null;

  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  return createMicroRegions(data, id);
};

type TSelectMicroRegionAvailabilityForCard = (
  projectId: string,
  region: string,
) => boolean;

export const isMicroRegionAvailable: Reader<
  Deps,
  TSelectMicroRegionAvailabilityForCard
> = (deps) => (projectId, region) => {
  const microRegions = selectMicroRegions(deps)(projectId, region);

  if (!microRegions?.length) return true;
  const hasOneMicroRegion = microRegions.length === 1;

  return hasOneMicroRegion ? !microRegions[0]?.disabled : true;
};
