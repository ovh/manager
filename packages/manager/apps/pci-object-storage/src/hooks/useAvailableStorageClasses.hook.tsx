import { useParams } from 'react-router-dom';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';
import storages from '@/types/Storages';

export function useAvailableStorageClasses(region: string) {
  const { projectId } = useParams();
  const regionQuery = useGetRegions(projectId);

  const regions = regionQuery.data;

  if (!regions) {
    return [];
  }

  const s3Region = regions.find((r) => r.name === region);
  const regionType = s3Region?.type;

  return Object.values(storages.StorageClassEnum).filter((st) => {
    if (!regionType) return false;

    switch (st) {
      case storages.StorageClassEnum.DEEP_ARCHIVE:
        return s3Region.name === "EU-WEST-PAR" 
        // Cold archive is only available in EU-WEST-PAR

      case storages.StorageClassEnum.HIGH_PERF:
        return regionType !== RegionTypeEnum['region-3-az'];

      case storages.StorageClassEnum.STANDARD_IA:
        return regionType !== RegionTypeEnum.localzone;

      default:
        return true;
    }
  });
}
