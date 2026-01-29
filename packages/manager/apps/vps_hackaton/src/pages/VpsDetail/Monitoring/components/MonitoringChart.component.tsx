import { useMemo } from 'react';
import { OdsText } from '@ovhcloud/ods-react';
import type { TMonitoringDataPoint } from '@/domain/entities/monitoring';

type TMonitoringChartProps = {
  title: string;
  data: Array<TMonitoringDataPoint>;
  unit: string;
  color: string;
};

export const MonitoringChart = ({
  title,
  data,
  unit,
  color,
}: TMonitoringChartProps) => {
  const { maxValue, avgValue, minValue, points } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, avgValue: 0, minValue: 0, points: '' };
    }

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // Create SVG path for the chart
    const width = 300;
    const height = 80;
    const normalizedMax = max === 0 ? 1 : max;

    const pathPoints = data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (point.value / normalizedMax) * height;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return {
      maxValue: max,
      avgValue: avg,
      minValue: min,
      points: pathPoints,
    };
  }, [data]);

  const formatValue = (value: number): string => {
    if (unit === 'B/s') {
      if (value >= 1024 * 1024 * 1024) {
        return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB/s`;
      }
      if (value >= 1024 * 1024) {
        return `${(value / 1024 / 1024).toFixed(2)} MB/s`;
      }
      if (value >= 1024) {
        return `${(value / 1024).toFixed(2)} KB/s`;
      }
      return `${value.toFixed(0)} B/s`;
    }
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <OdsText preset="heading-5" className="mb-4">
        {title}
      </OdsText>

      {data && data.length > 0 ? (
        <>
          <div className="mb-4">
            <svg
              viewBox="0 0 300 80"
              className="h-20 w-full"
              preserveAspectRatio="none"
            >
              <path
                d={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <OdsText preset="caption" className="text-gray-500">
                Min
              </OdsText>
              <OdsText preset="paragraph" className="font-medium">
                {formatValue(minValue)}
              </OdsText>
            </div>
            <div>
              <OdsText preset="caption" className="text-gray-500">
                Avg
              </OdsText>
              <OdsText preset="paragraph" className="font-medium">
                {formatValue(avgValue)}
              </OdsText>
            </div>
            <div>
              <OdsText preset="caption" className="text-gray-500">
                Max
              </OdsText>
              <OdsText preset="paragraph" className="font-medium">
                {formatValue(maxValue)}
              </OdsText>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-20 items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};
