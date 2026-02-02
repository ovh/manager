import { TMacroRegion, TMicroRegion } from '@/domain/entities/catalog.entity';

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

const IOPS_PER_GIB = 24;
const MAX_IOPS = 16_000;
const THROUGHPUT_MIB_PER_SECOND_PER_GIB = 0.25;
const MIN_THROUGHPUT_MIB_PER_SECOND = 25;
const MAX_THROUGHPUT_MIB_PER_SECOND = 128;

export const calculateProvisionedPerformance = (storageSizeInGiB: number) => {
  const iops = Math.min(storageSizeInGiB * IOPS_PER_GIB, MAX_IOPS);

  const throughput =
    storageSizeInGiB < 100
      ? MIN_THROUGHPUT_MIB_PER_SECOND
      : Math.min(
          storageSizeInGiB * THROUGHPUT_MIB_PER_SECOND_PER_GIB,
          MAX_THROUGHPUT_MIB_PER_SECOND,
        );

  return { iops, throughput };
};
