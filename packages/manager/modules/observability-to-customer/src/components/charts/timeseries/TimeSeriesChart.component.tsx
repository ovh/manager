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

import { ColorScale, DEFAULT_BRUSH_HEIGHT, DEFAULT_LEGEND_TYPE, getFormatter } from '../config';
import { TimeSeriesChartConfig, TimeSeriesChartProps } from './TimeSeriesChart.type';

export const TimeSeriesChartComponent = <TData,>({
  data,
  chartConfig,
  isFullscreen = false,
}: Readonly<TimeSeriesChartProps<TData>>): JSX.Element => {
  const timeseriesChartConfig = chartConfig as TimeSeriesChartConfig;
  const {
    dataKey: XAxisDataKey,
    formatter: xAxisFormatter,
    interval: xAxisInterval,
  } = timeseriesChartConfig.XAxis;

  const { dataKeys: YAxisDataKeys } = timeseriesChartConfig.YAxis;

  const curveType = timeseriesChartConfig.curveType ?? 'monotone';

  const { brush } = timeseriesChartConfig;

  const formatter = getFormatter(xAxisFormatter);

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
    : { top: 0, bottom: 0, left: 50, right: 30 };

  const legendAlign = isFullscreen ? 'center' : 'left';
  const legendVerticalAlign = isFullscreen ? 'bottom' : 'top';
  const legendMargins = isFullscreen ? { marginBottom: -20 } : { marginTop: -20 };

  const [lineChartData, setLineChartData] = useState<TData[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setLineChartData(data);
    }
  }, [data]);

  return (
    <ResponsiveContainer className="w-full h-full">
      <LineChart data={lineChartData} margin={chartMargin}>
        {YAxisDataKeys && YAxisDataKeys.length > 1 && (
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
          {...(formatter && { tickFormatter: formatter })}
          {...(xAxisInterval && {
            interval: Math.floor(lineChartData.length / xAxisInterval),
          })}
        />
        <YAxis padding={{ top: 20 }} />
        <Tooltip
          {...(formatter && { labelFormatter: formatter })}
          formatter={(value: number) => [value, YAxisDataKeys]}
        />
        {YAxisDataKeys.map((yAxisDataKey: string, index: number) => (
          <Line
            isAnimationActive={false}
            key={`${yAxisDataKey}_${index}`}
            type={curveType}
            dot={false}
            dataKey={yAxisDataKey}
            stroke={ColorScale.light}
          />
        ))}
        {brush && (
          <Brush
            dataKey={XAxisDataKey}
            height={brush?.height || DEFAULT_BRUSH_HEIGHT}
            stroke={ColorScale.dark}
            {...(formatter && { tickFormatter: formatter })}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChartComponent;
