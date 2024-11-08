import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { getFloatingIps, TFloatingIp } from '../data/floating-ips';

export const defaultFloatingIps: TFloatingIp[] = [
  {
    associatedEntity: null,
    id: 'create',
    ip: 'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
    networkId: '',
    status: '',
    type: 'create',
  },
  {
    associatedEntity: null,
    id: 'none',
    ip: 'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
    networkId: '',
    status: '',
    type: 'none',
  },
];

export const useDefaultFloatingIp = () => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  return defaultFloatingIps.map((floatingIp) => ({
    ...floatingIp,
    ip: tCreate(floatingIp.ip),
  }));
};

export const useGetFloatingIps = (projectId: string, region: string) => {
  const query = useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
  });

  const defaultFloatingIp = useDefaultFloatingIp();

  const filteredData = useMemo(
    () =>
      [
        ...(query.data || [])
          .filter((ip) => !ip.associatedEntity)
          .map((ip) => ({
            ...ip,
            type: 'ip',
          })),
      ] as TFloatingIp[],
    [query.data],
  );

  const filteredDataWithDefaults = useMemo(
    () => [...defaultFloatingIp, ...filteredData],
    [query.data, defaultFloatingIp],
  );

  return {
    ...query,
    filteredData,
    filteredDataWithDefaults,
  };
};
