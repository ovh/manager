import { v6 } from '@ovh-ux/manager-core-api';

import { useServiceType } from '@/data/hooks/service-type/useServiceType';

import { getApiPath } from '../utils/apiPath';
import { UsageStatisticsData, UsageStatisticsParams } from './type';

export const getOfficeUsageStatistics = async (
  serviceName: string,
  params: UsageStatisticsParams,
) => {
  const serviceType = useServiceType(serviceName);
  const apiPath = getApiPath(serviceName);

  const endpoint =
    serviceType === 'payAsYouGo' ? `${apiPath}usageStatistics` : `${apiPath}tenantUsageStatistics`;

  const { data } = await v6.get<UsageStatisticsData[]>(endpoint, { params });
  return data;
};
