import { IamObject } from '@ovh-ux/muk';

import { RequestPayload } from '@/types/RequestPayload.type';
import { ChartData } from '@/types/charts/base/Chart.type';
import { ChartWidget } from '@/types/widget/ChartWidget.type';

export type TIdentifier = {
  id: string;
};

export type TObservabilityResource = {
  iam?: IamObject;
  createdAt: string;
  updatedAt: string | null;
} & TIdentifier;

export type ObservabilityService = {
  currentState: { displayName: string | null };
} & TObservabilityResource;

export type Dashboard = { currentState: ChartWidget[] } & TObservabilityResource;

export type Kind = {
  currentState: {
    name: string;
    displayName: string;
    chart: ChartWidget;
  };
} & TObservabilityResource;

export type MetricData<TData> = ChartData<TData>;

export type ObservabilityChartDataParams = {
  chartId: string;
  payload: RequestPayload;
  signal?: AbortSignal;
};
