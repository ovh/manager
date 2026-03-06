import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const DISTANT_BACKUP = 'public-cloud:distant-backup';
export const OBSERVABILITY = 'pci-instances:observability';
export const OBSERVABILITY_M2C = 'pci-instances:observability:m2c';

export const useIsDistantBackupAvailable = () => {
  const { data } = usePCIFeatureAvailability([DISTANT_BACKUP]);

  return data?.get(DISTANT_BACKUP) ?? false;
};

export const useObservabilityAvailability = () => {
  const { data, isPending } = usePCIFeatureAvailability([
    OBSERVABILITY,
    OBSERVABILITY_M2C,
  ]);

  return {
    isObservabilityAvailable: Boolean(
      data?.get(OBSERVABILITY),
    ),
    isM2CAvailable: Boolean(
      data?.get(OBSERVABILITY_M2C),
    ),
    isPending,
  };
};
