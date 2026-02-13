import { useParams } from 'react-router-dom';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';
import storages from '@/types/Storages';
import {
  COLD_ARCHIVE_REGIONS,
  GLACIER_IR_REGIONS,
} from '@/configuration/region.const';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';

export const STORAGE_CLASS_TIER: Record<storages.StorageClassEnum, number> = {
  STANDARD: 0,
  HIGH_PERF: 0,
  STANDARD_IA: 1,
  GLACIER_IR: 2,
  DEEP_ARCHIVE: 3,
};

export function useAvailableStorageClasses(region: string) {
  const { data: featuresAvailable } = useFeatureAvailability([
    'pci-object-storage:storage-class-active-archive',
  ]);

  const isActiveArchiveFeatureAvailable =
    featuresAvailable?.['pci-object-storage:storage-class-active-archive'];
  const { projectId } = useParams();
  const regionQuery = useGetRegions(projectId);

  const regions = regionQuery.data;

  if (!regions) {
    return {
      availableStorageClasses: [],
      isPending: regionQuery.isPending,
    };
  }

  const s3Region = regions.find((r) => r.name === region);
  const regionType = s3Region?.type;

  const availableStorageClasses = Object.values(
    storages.StorageClassEnum,
  ).filter((st) => {
    if (!regionType) return false;

    switch (st) {
      case storages.StorageClassEnum.DEEP_ARCHIVE:
        return COLD_ARCHIVE_REGIONS.includes(s3Region.name);

      case storages.StorageClassEnum.GLACIER_IR:
        return isActiveArchiveFeatureAvailable
          ? GLACIER_IR_REGIONS.includes(s3Region.name)
          : false;

      case storages.StorageClassEnum.HIGH_PERF:
        return regionType !== RegionTypeEnum['region-3-az'];

      case storages.StorageClassEnum.STANDARD_IA:
        return regionType !== RegionTypeEnum.localzone;

      default:
        return true;
    }
  });

  const sorted = [...availableStorageClasses].sort(
    (a, b) => (STORAGE_CLASS_TIER[a] ?? 0) - (STORAGE_CLASS_TIER[b] ?? 0),
  );

  return {
    availableStorageClasses: sorted,
    isPending: regionQuery.isPending,
  };
}
