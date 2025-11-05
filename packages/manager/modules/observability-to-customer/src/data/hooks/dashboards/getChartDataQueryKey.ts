import { RequestPayload } from '@/types/RequestPayload.type';

export const getChartDataQueryKey = (payload: RequestPayload) =>
  [
    'chartData',
    'type',
    payload.type,
    'query',
    payload.query,
    'start',
    payload.start,
    'end',
    payload.end,
    'step',
    payload.step,
  ] as const;

export default getChartDataQueryKey;
