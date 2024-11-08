import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getFloatingIps } from '../data/floating-ips';
import { FLOATING_IP_TYPE } from '@/constants';

export const useDefaultFloatingIp = () => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  return [
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
  ];
};

export const useGetFloatingIps = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
  });
