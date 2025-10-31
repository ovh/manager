import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { FormattedStorage, ObjectStorageTypeEnum } from '@/types/Storages';

export function createRegionWithAllInfo(
  containers: FormattedStorage[],
  regions: Region[],
) {
  const containersWithRegionInfo: FormattedStorage[] = containers.map(
    (container) => ({
      ...container,
      regionObj: regions.find((reg) => reg.name === container.region),
      storageType: container?.s3StorageType
        ? ObjectStorageTypeEnum.s3
        : ObjectStorageTypeEnum.swift,
    }),
  );

  return containersWithRegionInfo;
}
