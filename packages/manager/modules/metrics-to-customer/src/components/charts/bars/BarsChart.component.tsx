import { BarsChartConfig, BarsChartProps } from './BarsChart.type';

export const BarsChartComponent = <TData,>({
  chartConfig,
}: Readonly<BarsChartProps<TData>>): JSX.Element => {
  const barsChartConfig = chartConfig as BarsChartConfig;

  return <>Bars Chart placeholder {barsChartConfig.type}</>;
};

export default BarsChartComponent;
