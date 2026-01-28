import { TMacroRegion, TMicroRegion } from '@/domain/entities/catalog.entity';

export const getMicroRegions = (
  macroRegion: TMacroRegion | undefined,
  microRegionsById: Map<string, TMicroRegion>,
) =>
  (macroRegion?.microRegions ?? [])
    .map((microRegionId) => microRegionsById.get(microRegionId))
    .filter((micro) => !!micro) ?? [];

export const isMacroRegionAvailable = (
  macroRegion: TMacroRegion | undefined,
  microRegionsById: Map<string, TMicroRegion>,
) => {
  const microRegions = getMicroRegions(macroRegion, microRegionsById);

  if (!microRegions.length) return false;

  return microRegions.some(
    (microRegion) => microRegion.isActivated && !microRegion.isInMaintenance,
  );
};
