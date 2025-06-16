import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const useIAMFeatureAvailability = () => {
  const { data: iamFeature } = usePCIFeatureAvailability([
    'iam-authentication',
  ]);

  return iamFeature?.get('iam-authentication');
};
