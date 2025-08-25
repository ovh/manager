import { v6 } from '@ovh-ux/manager-core-api';
import { TCurrentUsage } from './consumption';

export type TUsageHistoryPeriod = {
  id: string;
  lastUpdate: string;
  period: {
    from: string;
    to: string;
  };
};

export const getUsageHistoryPeriod = async (
  projectId: string,
  from: string,
  to: string,
): Promise<TUsageHistoryPeriod[]> => {
  const { data } = await v6.get<TUsageHistoryPeriod[]>(
    `/cloud/project/${projectId}/usage/history?from=${from}&to=${to}`,
  );

  return data;
};

type THistoryUsage = TCurrentUsage;

export const getUsageHistory = async (
  projectId: string,
  usageId: string,
): Promise<THistoryUsage> => {
  const { data } = await v6.get<THistoryUsage>(
    `/cloud/project/${projectId}/usage/history/${usageId}`,
  );

  return data;
};
