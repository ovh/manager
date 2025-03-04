import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFloatingIps } from '@/api/data/floating-ips';
import {
  FLOATING_IP_ADDON_FAMILY,
  FloatingIpSelectionId,
} from './useFloatingIps.constant';
import { Addon } from '@/types/addon.type';
import { useRegionAddons } from '../useAddons/useAddons';

export const useFloatingIps = (projectId: string, region?: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!region,
    select: (floatingIps) =>
      floatingIps.filter((floatingIp) => !floatingIp.associatedEntity),
  });

export const useSelectFloatingIps = (projectId: string, region?: string) => {
  const { data, isFetching } = useFloatingIps(projectId, region);

  return useMemo(
    () => ({
      floatingIps: [
        {
          id: FloatingIpSelectionId.NEW,
          label:
            'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
        },
        {
          id: FloatingIpSelectionId.UNATTACHED,
          label:
            'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
        },
        ...(data ? data.map(({ id, ip }) => ({ id, label: ip })) : []),
      ],
      isFetching,
    }),
    [data, isFetching],
  );
};

export const useRegionFloatingIpAddons = (
  ovhSubsidiary: string,
  projectId: string,
  region: string,
): { addons: Addon[]; isFetching: boolean } =>
  useRegionAddons(ovhSubsidiary, projectId, region, FLOATING_IP_ADDON_FAMILY);
