import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubnetGateways } from '@/api/data/gateways';
import { useRegionAddons } from '../useAddons/useAddons';
import { GATEWAY_ADDON_FAMILY } from './useGateways.constant';

export const useSubnetGateways = (
  projectId: string,
  regionName: string,
  subnetId: string,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      regionName,
      'subnet',
      subnetId,
      'gateways',
    ],
    queryFn: () => getSubnetGateways(projectId, regionName, subnetId),
    enabled: !!projectId && !!regionName && !!subnetId,
    throwOnError: true,
  });

export const useRegionGatewayAddons = (
  ovhSubsidiary: string,
  projectId: string,
  region: string,
) => useRegionAddons(ovhSubsidiary, projectId, region, GATEWAY_ADDON_FAMILY);

export const useSmallestGatewayRegion = (
  ovhSubsidiary: string,
  projectId: string,
  region: string,
) => {
  const { addons } = useRegionGatewayAddons(ovhSubsidiary, projectId, region);

  return useMemo(() => (addons ? addons[0] : null), [addons]);
};
