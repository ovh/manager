import { CHART_TYPE, ChartConfigBase } from '@/types/charts/base/Chart.type';
import { CurveType } from '@/types/charts/CurveType';
import { FormatterConfig } from '@/types/charts/formatterConfig.type';

export type TimeSeriesChartConfig = ChartConfigBase<typeof CHART_TYPE.TIME_SERIES> & {
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
