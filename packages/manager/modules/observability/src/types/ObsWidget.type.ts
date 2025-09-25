import { ObsChartType } from './enums/ObsChartType';

export type ObsWidget = {
  id: string;
  title: string;
  chart: ObsChart;
  unit?: string;
  colspan?: number;
  rowspan?: number;
  tooltip?: ObsChartTooltip;
  query: string;
};

// Base chart type with common properties
export type ObsChartBase = {
  type: ObsChartType;
};

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

// TimeSeries chart specific properties
export type ObsChartTimeSeries = ObsChartBase & {
  type: ObsChartType.TimeSeries;
  curveType?: CurveType;
  XAxis: {
    dataKey: string;
    interval?: number;
    formatter?: string;
  };
  YAxis: {
    dataKey: string;
  };
  brush?: {
    height?: number;
  };
};

// Bars chart specific properties
export type ObsChartBars = ObsChartBase & {
  type: ObsChartType.Bars;
};

// StackedBars chart specific properties
export type ObsChartStackedBars = ObsChartBase & {
  type: ObsChartType.StackedBars;
};

// Pie chart specific properties
export type ObsChartPie = ObsChartBase & {
  type: ObsChartType.Pie;
  dataKey: string;
  nameKey: string;
};

// Union type for all chart types
export type ObsChart =
  | ObsChartTimeSeries
  | ObsChartBars
  | ObsChartStackedBars
  | ObsChartPie;

export type ObsChartWithData = ObsWidget & {
  data: any[];
  isLoading: boolean;
};

export type ObsChartTooltip = {
  title: string;
  subTitle?: string;
  content?: string[];
  footer?: string;
};

export interface ObsChartProps {
  id: string;
  title: string;
  data: any[];
  chart: ObsChart;
  isLoading: boolean;
  isFullscreen?: boolean;
}
export interface ChartRendererProps extends ObsChartProps {
  type: ObsChartType;
}

// TimeSeries chart Props specific properties
export type ObsTimeSeriesChartProps = ObsChartProps & {
  selectedTimeOption: string;
};
