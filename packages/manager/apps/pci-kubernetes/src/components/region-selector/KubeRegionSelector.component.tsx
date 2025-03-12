import {
  PCICommonContext,
  RegionSelector,
  RegionSelectorProps,
  TLocalisation,
  TRegion,
  usePCICommonContextFactory,
  useProductAvailability,
  useProjectRegions,
} from '@ovh-ux/manager-pci-common';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { TRegionType } from '@/pages/new/steps/LocationStep.component';
import './KubeRegionSelector.css';

export interface KubeRegionSelectorProps {
  projectId: string;
  onSelectRegion: RegionSelectorProps['onSelectRegion'];
  selectedDeployment: TRegionType;
}

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some((region) => region.type === 'region-3-az');

const isMatchesType = (
  region: TLocalisation,
  product: { regions: Array<{ name: string; type: string }> },
  target: string,
): boolean =>
  product.regions.some(
    ({ name, type: rType }) => name === region.name && rType === target,
  );

export function KubeRegionSelector({
  projectId,
  onSelectRegion,
  selectedDeployment,
}: Readonly<KubeRegionSelectorProps>) {
  // - Original -
  // const { data: availability, isPending } = useProductAvailability(projectId, {
  //   product: 'kubernetes',
  // });

  // - A supprimer -
  const { data, isPending } = useProductAvailability(projectId, {
    product: 'kubernetes',
  });

  // mock with region 3az - A supprimer -
  const availability = {
    plans: [],
    products: [
      {
        name: 'kubernetes',
        regions: [
          {
            name: 'BHS5',
            datacenter: 'BHS',
            continentCode: 'NA',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'DE1',
            datacenter: 'DE',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA-STAGING-A',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA11',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA7',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA9',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'SBG5',
            datacenter: 'SBG',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'SGP1',
            datacenter: 'SGP',
            continentCode: 'ASIA',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'SYD1',
            datacenter: 'SYD',
            continentCode: 'ASIA',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'UK1',
            datacenter: 'UK',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'WAW1',
            datacenter: 'WAW',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'EU-WEST-PAR',
            datacenter: 'WAW',
            continentCode: 'EU',
            enabled: true,
            type: 'region-3-az',
            availabilityZones: [
              'eu-west-par-a',
              'eu-west-par-b',
              'eu-west-par-c',
            ],
          },
        ],
      },
    ],
  };

  const regionFilter = useMemo(() => {
    const product = availability?.products.find(
      ({ name }) => name === 'kubernetes',
    );
    return (region: TLocalisation) => {
      if (!product) return true;
      if (
        selectedDeployment &&
        product.regions.some(({ type }) => type === selectedDeployment)
      ) {
        return (
          region.isMacro || isMatchesType(region, product, selectedDeployment)
        );
      }
      return (
        region.isMacro ||
        isMatchesType(region, product, 'region') ||
        isMatchesType(region, product, 'region-3-az')
      );
    };
  }, [availability, selectedDeployment]);

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
      <div className="mt-6">
        <RegionSelector
          projectId={projectId}
          onSelectRegion={onSelectRegion}
          regionFilter={regionFilter}
        />
      </div>
    </PCICommonContext.Provider>
  );
}
