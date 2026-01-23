import { CHART_TYPE, ChartConfigBase, ChartProps } from '../base';
import { CurveType } from '../config/CurveType';
import { FormatterConfig } from '../config/formatterConfig.type';

export type TimeSeriesChartConfig = ChartConfigBase<typeof CHART_TYPE.TimeSeries> & {
  curveType?: CurveType;
  XAxis: {
    dataKey: string;
    interval?: number;
    formatter?: FormatterConfig;
  };
  YAxis: {
    dataKeys: string[];
    formatter?: string;
  };
  tooltip?: {
    key?: {
      formatter?: FormatterConfig;
    }
    value?: {
      formatter?: FormatterConfig;
    }
  },
  brush?: {
    height?: number;
  };
};

export type TimeSeriesChartProps<TData> = ChartProps<TData>;
