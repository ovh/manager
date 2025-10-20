import { CHART_TYPE, ChartConfigBase } from '../base';
import { CurveType } from './CurveType.type';

export type TimeSeriesChartConfig = ChartConfigBase<typeof CHART_TYPE.TimeSeries> & {
  curveType?: CurveType;
  XAxis: {
    dataKey: string;
    interval?: number;
    formatter?: string;
  };
  YAxis: {
    dataKeys: string[];
  };
  brush?: {
    height?: number;
  };
};
