import {
  RegionSelector,
  RegionSelectorProps,
} from '@ovh-ux/manager-pci-common';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useProductAvailability } from '@/api/hooks/useAvailability';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: RegionSelectorProps['onSelectRegion'];
}

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
}: Readonly<KubeRegionSelectorProps>) {
  const { data: availability, isPending } = useProductAvailability(projectId);
  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }
  return (
    <RegionSelector
      projectId={projectId}
      onSelectRegion={onSelectRegion}
      regionFilter={(region) => {
        const product = availability?.products.find(
          ({ name }) => name === 'kubernetes',
        );
        return (
          region.isMacro ||
          product?.regions?.some(({ name }) => name === region.name)
        );
      }}
      compactMode
    />
  );
}
