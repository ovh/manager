import { Deps } from '@/deps/deps';
import { TMicroRegion } from '@/domain/entities/instancesCatalog';
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

export const selectMicroRegions: Reader<Deps, TSelectMicroRegionData> = (
  deps,
) => (projectId, macroRegionId) => {
  if (!macroRegionId) return null;

  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const { macroRegions, microRegions } = data.entities;

  const foundMacroRegion = macroRegions.byId.get(macroRegionId);
  if (!foundMacroRegion) return [];

  return foundMacroRegion.microRegions.flatMap((microRegion) => {
    const foundMicroRegion = microRegions.byId.get(microRegion);
    return foundMicroRegion ? mapMicroRegion(foundMicroRegion) : [];
  });
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
