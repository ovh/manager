import { CHART_TYPE, ChartConfigBase, ChartProps } from '../base';

export type BarsChartConfig = ChartConfigBase<typeof CHART_TYPE.Bars>;

export type BarsChartProps<TData> = ChartProps<TData>;
