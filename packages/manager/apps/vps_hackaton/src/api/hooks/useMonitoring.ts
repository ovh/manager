import { useQuery } from '@tanstack/react-query';
import { vpsMonitoringQueryKey } from '@/adapters/tanstack/vps/vps.queryKey';
import { getFullMonitoring } from '@/api/data/monitoring.api';
import type {
  TMonitoringData,
  TMonitoringPeriod,
} from '@/domain/entities/monitoring';
import type { TSelectOptions } from './types';

export const useMonitoring = <TData = TMonitoringData>(
  serviceName: string,
  period: TMonitoringPeriod,
  { select }: TSelectOptions<TMonitoringData, TData> = {},
) => {
  return useQuery({
    queryKey: vpsMonitoringQueryKey(serviceName, period, 'full'),
    queryFn: () => getFullMonitoring(serviceName, period),
    select,
    enabled: !!serviceName,
    refetchInterval: 60 * 1000, // Refresh every minute
  });
};
