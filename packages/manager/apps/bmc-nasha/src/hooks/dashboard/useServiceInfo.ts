import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getJSON } from '@/data/api/Client.api';
import { SERVICE_TYPE } from '@/pages/dashboard/Dashboard.constants';
import type { ServiceInfo, ServiceInfoRaw } from '@/types/Dashboard.type';

export function useServiceInfo(serviceName: string) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['nasha', 'serviceInfo', serviceName],
    queryFn: async (): Promise<ServiceInfo> => {
      const data = await getJSON<ServiceInfoRaw>(
        'v6',
        `/dedicated/nasha/${serviceName}/serviceInfos`,
      );
      return {
        ...data,
        serviceType: SERVICE_TYPE,
      };
    },
    enabled: !!serviceName,
  });
}

