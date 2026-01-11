import type { UseQueryResult } from '@tanstack/react-query';

import type { MetricData } from '@/types/observability.type';

export type ChartQueryResult<TData> = UseQueryResult<MetricData<TData>, unknown>;
