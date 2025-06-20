import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const useIAMFeatureAvailability = () => {
  const { data: iamFeature, isPending } = usePCIFeatureAvailability([
    'pci-private-registry:iam-authentication',
  ]);

  return {
    isIAMEnabled: Boolean(
      iamFeature?.get('pci-private-registry:iam-authentication'),
    ),
    isPending,
  };
};
