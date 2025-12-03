import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const DISTANT_BACKUP = 'public-cloud:distant-backup';

export const useIsDistantBackupAvailable = () => {
  const { data } = usePCIFeatureAvailability([DISTANT_BACKUP]);

  return data?.get(DISTANT_BACKUP);
};
