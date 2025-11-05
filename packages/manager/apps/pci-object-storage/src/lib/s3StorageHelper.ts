import storages from '@/types/Storages';

export interface StorageClassFilterOptions {
  is3AZ?: boolean;
  isLZ?: boolean;
}

export function getAvailableStorageClasses({
  is3AZ = false,
  isLZ = false,
}: StorageClassFilterOptions = {}): storages.StorageClassEnum[] {
  return Object.values(storages.StorageClassEnum).filter((st) => {
    switch (st) {
      case storages.StorageClassEnum.DEEP_ARCHIVE:
        return is3AZ;
      case storages.StorageClassEnum.HIGH_PERF:
        return !is3AZ;
      case storages.StorageClassEnum.STANDARD_IA:
        return !isLZ;
      default:
        return true;
    }
  });
}
