import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getFloatingIps } from '../data/floating-ips';
import { FLOATING_IP_TYPE } from '@/constants';

export const useGetFloatingIps = (projectId: string, region: string) => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  const query = useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
  });

  const list = useMemo(
    () => [
      {
        associatedEntity: null,
        id: 'create',
        ip: tCreate(
          'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
        ),
        networkId: '',
        status: '',
        type: FLOATING_IP_TYPE.CREATE,
      },
      {
        associatedEntity: null,
        id: 'none',
        ip: tCreate(
          'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
        ),
        networkId: '',
        status: '',
        type: FLOATING_IP_TYPE.NO_IP,
      },
      ...(query.data || [])
        .filter((ip) => !ip.associatedEntity)
        .map((ip) => ({
          ...ip,
          type: FLOATING_IP_TYPE.IP,
        })),
    ],
    [query.data],
  );

  return {
    ...query,
    list,
  };
};
