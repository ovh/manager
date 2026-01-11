import { CHART_TYPE, ChartConfigBase, ChartProps } from '../base';

export type CurveType =
  | 'basis'
  | 'basisClosed'
  | 'basisOpen'
  | 'bumpX'
  | 'bumpY'
  | 'bump'
  | 'linear'
  | 'linearClosed'
  | 'natural'
  | 'monotoneX'
  | 'monotoneY'
  | 'monotone'
  | 'step'
  | 'stepBefore'
  | 'stepAfter';

export type TimeSeriesChartConfig = ChartConfigBase<typeof CHART_TYPE.TimeSeries> & {
  curveType?: CurveType;
  XAxis: {
    dataKey: string;
    interval?: number;
    formatter?: string;
  };
  YAxis: {
    dataKeys: string[];
    formatter?: string;
  };
  brush?: {
    height?: number;
  };
};

export type TimeSeriesChartProps<TData> = ChartProps<TData>;
