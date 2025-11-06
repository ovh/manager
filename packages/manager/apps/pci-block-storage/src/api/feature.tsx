import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const FILE_STORAGE_ALPHA = 'pci-block-storage:file-storage-alpha-banner';

export const useIsFileStorageAlphaBannerAvailable = () => {
  const { data } = usePCIFeatureAvailability([FILE_STORAGE_ALPHA]);

  return data?.get(FILE_STORAGE_ALPHA) ?? false;
};
