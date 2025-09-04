import React from 'react';
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
  DEFAULT_BRUSH_HEIGHT,
  DEFAULT_LEGEND_TYPE,
  getFormatter,
} from './config';
import { ColorScale } from './config/theme';
import { ObsChartTimeSeries, ObsTimeSeriesChartProps } from '../../types';

const ObsTimeSeriesChart = ({
  data,
  chart,
  isFullscreen = false,
  selectedTimeOption,
}: Readonly<ObsTimeSeriesChartProps>): JSX.Element => {
  console.log(`${selectedTimeOption} from timeseries component`);
  const timeseriesChartConfig = chart as ObsChartTimeSeries;
  const {
    dataKey: XAxisDataKey,
    formatter: xAxisFormatter,
    interval: xAxisInterval,
  } = timeseriesChartConfig.XAxis;
  const { dataKey: YAxisDataKey } = timeseriesChartConfig.YAxis;
  const { brush } = timeseriesChartConfig;

  const formatter = getFormatter(xAxisFormatter);

  const legendPayload: LegendProps['payload'] = [
    {
      value: YAxisDataKey,
      type: DEFAULT_LEGEND_TYPE,
      color: ColorScale.light,
      id: YAxisDataKey,
    },
  ];

  const chartMargin = isFullscreen
    ? { top: 10, bottom: 20, left: 0, right: 10 }
    : { top: 0, bottom: 0, left: 20, right: 30 };
  const legendAlign = isFullscreen ? 'center' : 'left';
  const legendVerticalAlign = isFullscreen ? 'bottom' : 'top';
  const legendMargins = isFullscreen
    ? { marginBottom: -20 }
    : { marginTop: -20 };

  return (
    <ResponsiveContainer className="w-full h-full">
      <LineChart data={data} margin={chartMargin}>
        <Legend
          layout="horizontal"
          align={legendAlign}
          verticalAlign={legendVerticalAlign}
          wrapperStyle={legendMargins}
          payload={legendPayload}
        />
        <CartesianGrid stroke="#e0e0e0" strokeWidth={0.5} vertical={false} />
        <XAxis
          dataKey={XAxisDataKey}
          {...(formatter && { tickFormatter: formatter })}
          {...(xAxisInterval && {
            interval: Math.floor(data.length / xAxisInterval),
          })}
          // interval="equidistantPreserveStart"
        />
        <YAxis padding={{ top: 20 }} />
        <Tooltip
          {...(formatter && { labelFormatter: formatter })}
          formatter={(value: number) => [value, YAxisDataKey]}
        />
        <Line
          type="monotone"
          dot={false}
          dataKey={YAxisDataKey}
          stroke={ColorScale.light}
        />
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

export default ObsTimeSeriesChart;
