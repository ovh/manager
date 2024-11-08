import { useMemo } from 'react';
import { FLOATING_IP_TYPE } from '@/constants';
import {
  useDefaultFloatingIp,
  useGetFloatingIps,
} from '@/api/hook/useFloatingIps';

export const useFloatingIpsList = (projectId: string, region: string) => {
  const query = useGetFloatingIps(projectId, region);
  const defaultFloatingIp = useDefaultFloatingIp();

  const data = useMemo(
    () => [
      ...defaultFloatingIp,
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
    test: query,
    data,
    isPending: query.isPending || query.isFetching,
  };
};
