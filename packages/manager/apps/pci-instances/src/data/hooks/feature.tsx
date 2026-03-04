import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const DISTANT_BACKUP = 'public-cloud:distant-backup';
export const OBSERVABILITY = 'pci-instances:observability';

export const useIsDistantBackupAvailable = () => {
  const { data } = usePCIFeatureAvailability([DISTANT_BACKUP]);

  return data?.get(DISTANT_BACKUP) ?? false;
};

export const useIsObservabilityAvailable = () => {
  const { data } = usePCIFeatureAvailability([OBSERVABILITY]);

  return data?.get(OBSERVABILITY) ?? false;
};
