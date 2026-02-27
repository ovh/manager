import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const OBSERVABILITY = 'pci-instance:observability';

export const useIsObservabilityAvailable = () => {  
  const { data } = usePCIFeatureAvailability([OBSERVABILITY]);

  return data?.get(OBSERVABILITY) ?? false;
};
