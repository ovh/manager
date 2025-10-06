import { TFunction } from 'i18next';
import storages from '@/types/Storages';

export const getStorageClassLabel = (
  storageClass: storages.StorageClassEnum | undefined,
  t: TFunction,
): string => {
  if (!storageClass) return '-';

  const translationKey = `storageClass_${storageClass}`;
  return t(translationKey);
};

export const storageClassOptions = [
  storages.StorageClassEnum.STANDARD,
  storages.StorageClassEnum.STANDARD_IA,
  storages.StorageClassEnum.HIGH_PERF,
] as const;
