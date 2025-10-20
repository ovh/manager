import { IamObject } from '@ovh-ux/manager-react-components';

import { ChartData } from '../components/charts/base';
import { ChartWidget } from '../components/widget/ChartWidget.type';
import { RequestPayload } from './RequestPayload.type';

type TObservability = {
  id: string;
  iam?: IamObject;
};

export type Tenant = { currentState: { title: string } } & TObservability;
export type ObservabilityService = {
  currentState: { displayName: string | null };
} & TObservability;

export type Dashboard = { currentState: ChartWidget[] } & TObservability;

export type MetricData<TData> = ChartData<TData>;

export type MetricKind = {
  currentState: {
    additionalReturnedFields: string[];
    displayName: string;
    name: string;
    kindId: string;
  };
} & TObservability;

export type ObservabilityChartDataParams = {
  chartId: string;
  payload: RequestPayload;
  signal?: AbortSignal;
};
