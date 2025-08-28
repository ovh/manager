import { usePCIFeatureAvailability } from '@ovh-ux/manager-pci-common';

export const use3AZFeatureAvailability = () => {
  const { data: multiRegionFeature, isPending } = usePCIFeatureAvailability([
    'pci-private-registry:deployment-3-az-region',
  ]);

  return {
    is3AZEnabled: Boolean(
      multiRegionFeature?.get('pci-private-registry:deployment-3-az-region'),
    ),
    isPending,
  };
};
