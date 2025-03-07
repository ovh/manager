import { useQuery } from '@tanstack/react-query';
import { getFloatingIps } from '@/api/data/floating-ips';
import { FLOATING_IP_ADDON_FAMILY } from './useFloatingIps.constant';
import { useRegionAddons } from '../useAddons/useAddons';

export const useFloatingIps = (projectId: string, region?: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!region,
    select: (floatingIps) =>
      floatingIps.filter((floatingIp) => !floatingIp.associatedEntity),
  });

export const useRegionFloatingIpAddons = (
  ovhSubsidiary: string,
  projectId: string,
  region: string,
) =>
  useRegionAddons(ovhSubsidiary, projectId, region, FLOATING_IP_ADDON_FAMILY);
