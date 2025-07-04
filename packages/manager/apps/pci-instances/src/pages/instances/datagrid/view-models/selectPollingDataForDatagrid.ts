import { TUseInstancesPolling } from '@/data/hooks/instance/polling/useInstancesPolling';

export type TDatagridPollingDataViewModel = {
  id: string;
  isPolling: boolean;
};

export const selectPollingDataForDatagrid = (
  pollingData: TUseInstancesPolling[],
): TDatagridPollingDataViewModel[] =>
  pollingData.map((d) => ({
    id: d.id,
    isPolling: !d.error,
  }));
