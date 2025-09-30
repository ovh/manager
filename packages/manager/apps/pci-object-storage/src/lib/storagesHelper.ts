import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { FormattedStorage, ObjectStorageTypeEnum } from '@/types/Storages';

export function createRegionWithAllInfo(
  containers: FormattedStorage[],
  regions: Region[],
) {
  const regionMap = new Map(regions.map((r) => [r.name, r.type]));

  const containersWithRegionInfo: FormattedStorage[] = containers.map(
    (container) => ({
      ...container,
      regionType: regionMap.get(container.region),
      storageType: container?.s3StorageType
        ? ObjectStorageTypeEnum.s3
        : ObjectStorageTypeEnum.swift,
    }),
  );

  return containersWithRegionInfo;
}
