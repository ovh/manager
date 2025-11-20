import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { QUOTA_THRESHOLD } from '@/constants';
import { getQuotas } from '@/data/api/quota';
import { Quota } from '@/data/models/Quota.type';

const getUsagePercentage = (max: number, used: number): number => {
  if (max === 0) return 100;
  return (used / max) * 100;
};

export const useQuotas = (projectId: string): UseQueryResult<Quota[]> => {
  return useQuery({
    queryKey: ['quotas', projectId],
    queryFn: () => getQuotas(projectId),
    select: (quotas): Quota[] =>
      quotas.map((quota) => {
        const instanceUsage = getUsagePercentage(
          quota.instance?.maxInstances,
          quota.instance?.usedInstances,
        );
        const cpuUsage = getUsagePercentage(quota.instance?.maxCores, quota.instance?.usedCores);
        const ramUsage = getUsagePercentage(quota.instance?.maxRam, quota.instance?.usedRAM);
        const memoryUsage = getUsagePercentage(
          quota.volume?.maxGigabytes,
          quota.volume?.usedGigabytes,
        );

        const quotaAboveThreshold =
          instanceUsage >= QUOTA_THRESHOLD ||
          cpuUsage >= QUOTA_THRESHOLD ||
          ramUsage >= QUOTA_THRESHOLD ||
          memoryUsage >= QUOTA_THRESHOLD;

        return {
          ...quota,
          instance: {
            ...quota.instance,
            instanceUsage,
            cpuUsage,
            ramUsage,
          },
          volume: {
            ...quota.volume,
            memoryUsage,
          },
          quotaAboveThreshold,
        } as Quota;
      }),
    throwOnError: true,
    retry: false,
  });
};

export const useIsQuotaAboveThreshold = (quotas: Quota[]): boolean => {
  return quotas.some((quota) => quota.quotaAboveThreshold);
};
