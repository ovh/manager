import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getQuotas } from '@/data/api/quota';
import { Quota } from '@/data/types/quota.type';
import { QUOTA_THRESHOLD } from '@/constants';

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
          quota.instance.maxInstances,
          quota.instance.usedInstances,
        );
        const cpuUsage = getUsagePercentage(
          quota.instance.maxCores,
          quota.instance.usedCores,
        );
        const ramUsage = getUsagePercentage(
          quota.instance.maxRam,
          quota.instance.usedRAM,
        );
        const memoryUsage = getUsagePercentage(
          quota.volume.maxGigabytes,
          quota.volume.usedGigabytes,
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
  });
};

export const useIsQuotaAboveThreshold = (quotas: Quota[]): boolean => {
  return quotas.some((quota) => quota.quotaAboveThreshold);
};
