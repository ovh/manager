import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { StorageClassEnum } from '@datatr-ux/ovhcloud-types/cloud/storage/StorageClassEnum';

export function getTotalVersionsSize(versions: StorageObject[]) {
  return versions.reduce((acc, curr) => acc + curr.size, 0);
}

export const isDeepArchive = (object: StorageObject) => {
  const { storageClass } = object;
  return storageClass === StorageClassEnum.DEEP_ARCHIVE;
};

export const isDeepArchiveRestored = (object: StorageObject) => {
  const { restoreStatus } = object;
  return isDeepArchive(object) && restoreStatus?.expireDate;
};
