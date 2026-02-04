import { TMacroRegion, TMicroRegion, TShareSpecs } from '@/domain/entities/catalog.entity';

export const isMicroRegionAvailable = (microRegion: TMicroRegion): boolean =>
  microRegion.isActivated && !microRegion.isInMaintenance;

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

  return microRegions.some(isMicroRegionAvailable);
};

export const provisionedPerformanceCalculator =
  ({ iops, bandwidth }: Pick<TShareSpecs, 'iops' | 'bandwidth'>) =>
  (shareSize: number) => {
    const calculatedIops = Math.min(shareSize * iops.level, iops.max);
    const dynamicThroughput = shareSize * bandwidth.level;
    const throughput = Math.max(bandwidth.min, Math.min(dynamicThroughput, bandwidth.max));
    return { iops: calculatedIops, throughput };
  };
