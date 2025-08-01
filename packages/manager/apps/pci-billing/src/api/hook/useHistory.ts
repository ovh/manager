import { useQuery } from '@tanstack/react-query';
import { isSameMonth } from 'date-fns';
import { useComputeDate } from '@/components/history/useComputeDate.hook';
import { getCurrentUsage, TCurrentUsage } from '../data/consumption';
import {
  getUsageHistory,
  getUsageHistoryPeriod,
  TUsageHistoryPeriod,
} from '../data/history';
import {
  getConsumptionDetails,
  initializeTConsumptionDetail,
} from './useConsumption';

export const useUsageHistoryPeriod = (
  projectId: string,
  from: string,
  to: string,
) =>
  useQuery({
    queryKey: [projectId, from, to, 'history', 'usage'],
    queryFn: async () => {
      const historyPeriod = await getUsageHistoryPeriod(projectId, from, to);
      return historyPeriod.length
        ? historyPeriod[0]
        : ({} as TUsageHistoryPeriod);
    },
  });

export const useGetUsageHistory = (
  projectId: string,
  periodDetail?: TUsageHistoryPeriod,
) => {
  const { billingDate } = useComputeDate();

  return useQuery({
    queryKey: [projectId, periodDetail?.id, 'history', 'usage'],
    queryFn: async () => {
      const historyUsage = await getUsageHistory(projectId, periodDetail?.id);
      let monthlyDetails: TCurrentUsage['monthlyUsage'];

      if (isSameMonth(new Date(), billingDate)) {
        const currentUsage = await getCurrentUsage(projectId);
        monthlyDetails = currentUsage.monthlyUsage;
      } else if (
        new Date(periodDetail?.period.to).getUTCMonth() ===
        billingDate.getMonth()
      ) {
        monthlyDetails = historyUsage.monthlyUsage;
      }

      const usage = { ...historyUsage, monthlyUsage: monthlyDetails };
      return getConsumptionDetails(usage);
    },
    enabled: !!periodDetail?.id,
    placeholderData: !periodDetail?.id
      ? initializeTConsumptionDetail()
      : undefined,
  });
};
