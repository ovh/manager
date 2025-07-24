import { useMemo, useState } from 'react';
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { ChartContainer } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { cn } from '@/lib/utils';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetMetric } from '@/hooks/api/database/metric/useGetMetric.hook';
import { useLocale } from '@/hooks/useLocale';
import { colors } from './colors.constants';
import { MetricChartTooltip } from './MetricChartTooltip.component';

interface MetricChartProps {
  metric: string;
  period: database.service.MetricPeriodEnum;
  pollInterval: number;
  poll: boolean;
  className?: string;
}
interface TransformedDataPoint {
  timestamp: number;
  [hostname: string]: number | number; // timestamp plus hostname keys with numeric values
}

const MetricChart = ({
  metric,
  period,
  poll = false,
  pollInterval = 0,
  className,
}: MetricChartProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics',
  );
  const [activeSeries, setActiveSeries] = useState<Array<string>>([]);
  const handleLegendClick = (dataKey: string) => {
    if (activeSeries.includes(dataKey)) {
      setActiveSeries(activeSeries.filter((el) => el !== dataKey));
    } else {
      setActiveSeries((prev) => [...prev, dataKey]);
    }
  };

  const { isUserActive } = useUserActivityContext();
  const { projectId, service } = useServiceData();
  const chartLocale = useLocale(); // useDateFnsLocale();

  const metricQuery = useGetMetric(
    projectId,
    service.engine,
    service.id,
    metric,
    period,
    {
      refetchInterval: isUserActive && poll && pollInterval,
    },
  );

  const transformedData = useMemo(() => {
    if (!metricQuery.data) return [];

    const mergedData: Record<number, TransformedDataPoint> = {};

    metricQuery.data.metrics.forEach((hostMetric) => {
      hostMetric.dataPoints.forEach((point) => {
        const timestamp = point.timestamp * 1000;
        if (!mergedData[timestamp]) {
          mergedData[timestamp] = { timestamp };
        }

        mergedData[timestamp][hostMetric.hostname] =
          metricQuery.data.units ===
          database.service.MetricUnitEnum.BYTES_PER_SECOND
            ? point.value / 1000
            : point.value;
      });
    });

    return Object.values(mergedData).sort((a, b) => a.timestamp - b.timestamp);
  }, [metricQuery.data]);

  const minTimestamp =
    transformedData.length > 0 ? transformedData[0].timestamp : 0;
  const maxTimestamp =
    transformedData.length > 0
      ? transformedData[transformedData.length - 1].timestamp
      : 0;

  const displayDay = ![
    database.service.MetricPeriodEnum.lastHour,
    database.service.MetricPeriodEnum.lastDay,
  ].includes(period);
  const formatter = (value: number) =>
    new Intl.DateTimeFormat(chartLocale.replace('_', '-'), {
      timeStyle: displayDay ? undefined : 'medium',
      dateStyle: displayDay ? 'short' : undefined,
    }).format(new Date(value));

  return (
    <ChartContainer
      data-testid="metric-chart-container"
      className={cn('relative min-h-[100px] w-full', className)}
      config={{}}
    >
      {metricQuery.isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white z-10">
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          {t('loading')}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transformedData} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={[minTimestamp, maxTimestamp]}
              tickFormatter={formatter}
            />
            <YAxis />
            <Legend
              onClick={(legend) => handleLegendClick(legend.dataKey as string)}
            />
            <Tooltip
              content={
                <MetricChartTooltip
                  unit={t(`metricUnit-${metricQuery.data?.units}`, {
                    defaultValue: metricQuery.data?.units,
                  })}
                />
              }
            />
            {metricQuery.data?.metrics.map((hostMetric, idx) => (
              <Area
                key={hostMetric.hostname}
                dataKey={hostMetric.hostname}
                type="monotone"
                stroke={colors[idx % colors.length].borderColor}
                fill={colors[idx % colors.length].backgroundColor}
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
                hide={activeSeries.includes(hostMetric.hostname)}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default MetricChart;
