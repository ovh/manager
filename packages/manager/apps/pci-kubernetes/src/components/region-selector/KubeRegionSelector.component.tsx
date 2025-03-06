import {
  PCICommonContext,
  RegionSelector,
  RegionSelectorProps,
  TRegion,
  usePCICommonContextFactory,
  useProductAvailability,
  useProjectRegions,
} from '@ovh-ux/manager-pci-common';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useMemo } from 'react';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: RegionSelectorProps['onSelectRegion'];
}

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some((region) => region.type === 'region-3-az');

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
}: Readonly<KubeRegionSelectorProps>) {
  const { data: availability, isPending } = useProductAvailability(projectId, {
    product: 'kubernetes',
  });

  const { data: regions } = useProjectRegions(projectId);

  const has3AZ = useMemo(() => (regions ? isRegionWith3AZ(regions) : false), [
    regions,
  ]);

  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }
  return (
    <PCICommonContext.Provider value={pciCommonProperties}>
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
      />
    </PCICommonContext.Provider>
  );
}
