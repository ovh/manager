import { useEffect, useState } from 'react';

import {
  Brush,
  CartesianGrid,
  Legend,
  LegendProps,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ColorScale,
} from '@/types/charts/theme';

import {
  DEFAULT_BRUSH_HEIGHT,
  DEFAULT_LEGEND_TYPE,
  getFormatter,
} from '@/components/charts/config';

import {
  TimeSeriesChartConfig,
  TimeSeriesChartProps,
} from '@/components/charts/timeseries';

export const TimeSeriesChartComponent = <TData,>({
  data,
  chartConfig,
  isFullscreen = false,
  locale,
}: Readonly<TimeSeriesChartProps<TData>>): JSX.Element => {
  const timeseriesChartConfig = chartConfig as TimeSeriesChartConfig;
  const {
    dataKey: XAxisDataKey,
    formatter: xAxisFormatter,
    interval: xAxisInterval,
  } = timeseriesChartConfig.XAxis;

  const { dataKeys: YAxisDataKeys, formatter: yAxisFormatter } =
    timeseriesChartConfig.YAxis;

  const tooltipKeyFormatterConfig =
    timeseriesChartConfig.tooltip?.key?.formatter ?? "formatTimestampToDateTime";

  const tooltipValueFormatterConfig =
    timeseriesChartConfig.tooltip?.value?.formatter;

  const curveType = timeseriesChartConfig.curveType ?? 'monotone';
  const { brush } = timeseriesChartConfig;

  const xFormatter = getFormatter(xAxisFormatter, { locale });
  const yFormatter = getFormatter(yAxisFormatter);
  const tooltipKeyFormatter = getFormatter(tooltipKeyFormatterConfig, { locale });
  const tooltipValueFormatter = getFormatter(tooltipValueFormatterConfig);

  const legendPayload: LegendProps['payload'] = YAxisDataKeys.map(
    (yAxisDataKey: string, index: number) => ({
      value: yAxisDataKey,
      type: DEFAULT_LEGEND_TYPE,
      color: Object.values(ColorScale)[index],
      id: yAxisDataKey,
    }),
  );

  const chartMargin = isFullscreen
    ? { top: 10, bottom: 20, left: 20, right: 10 }
    : { top: 0, bottom: 0, left: 0, right: 30 };

  const legendAlign = isFullscreen ? 'center' : 'left';
  const legendVerticalAlign = isFullscreen ? 'bottom' : 'top';
  const legendMargins = isFullscreen ? { marginBottom: -20 } : { marginTop: -20 };

  const [lineChartData, setLineChartData] = useState<TData[]>([]);

  useEffect(() => {
    if (data?.length) {
      setLineChartData(data);
    }
  }, [data]);

  return (
    <ResponsiveContainer className="w-full h-full">
      <LineChart data={lineChartData} margin={chartMargin}>
        {YAxisDataKeys.length > 1 && (
          <Legend
            layout="horizontal"
            align={legendAlign}
            verticalAlign={legendVerticalAlign}
            wrapperStyle={legendMargins}
            payload={legendPayload}
          />
        )}
        <CartesianGrid stroke="#e0e0e0" strokeWidth={0.5} vertical={false} />
        <XAxis
          dataKey={XAxisDataKey}
          {...(xFormatter && { tickFormatter: xFormatter })}
          {...(xAxisInterval && {
            interval: Math.floor(lineChartData.length / xAxisInterval),
          })}
        />
        <YAxis
          padding={{ top: 20 }}
          {...(yFormatter && { tickFormatter: yFormatter })}
        />
        <Tooltip
          {...(tooltipKeyFormatter && {
            labelFormatter: tooltipKeyFormatter,
          })}
          formatter={(value: number) => {
            const formattedValue = tooltipValueFormatter
              ? tooltipValueFormatter(value)
              : value;

            return [formattedValue, null];
          }}
        />

        {YAxisDataKeys.map((yAxisDataKey: string, index: number) => (
          <Line
            isAnimationActive={false}
            key={`${yAxisDataKey}_${index}`}
            type={curveType}
            dot={false}
            dataKey={yAxisDataKey}
            stroke={ColorScale.primary}
            strokeWidth={2}
          />
        ))}
        {brush && (
          <Brush
            dataKey={XAxisDataKey}
            height={brush.height ?? DEFAULT_BRUSH_HEIGHT}
            stroke={ColorScale.dark}
            {...(xFormatter && { tickFormatter: xFormatter })}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChartComponent;
