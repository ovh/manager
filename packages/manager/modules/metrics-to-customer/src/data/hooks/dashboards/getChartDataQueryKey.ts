import { RequestPayload } from '@/types/RequestPayload.type';

export const getChartDataQueryKey = (payload: RequestPayload, regionCode: string, metricToken: string) =>
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
    'regionCode',
    regionCode,
    'metricToken',
    metricToken,
  ] as const;

export default getChartDataQueryKey;
