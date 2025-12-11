import storages from '@/types/Storages';

// This storage class request to store data for 30 days at least so if we change for this class we display a warning
export const isMinimalDurationClass = (
  storageClass: storages.StorageClassEnum,
) => {
  return [
    storages.StorageClassEnum.STANDARD_IA,
    storages.StorageClassEnum.DEEP_ARCHIVE,
  ].includes(storageClass);
};
