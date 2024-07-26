import { useEffect, useState } from 'react';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ChartData,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { colors } from './colors.constants';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { useServiceData } from '../../Service.context';
import { cn } from '@/lib/utils';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetMetric } from '@/hooks/api/database/metric/useGetMetric.hook';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  zoomPlugin,
  TimeScale,
);

interface MetricChartProps {
  metric: string;
  period: database.service.MetricPeriodEnum;
  pollInterval: number;
  poll: boolean;
  className?: string;
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
  const chartLocale = useDateFnsLocale();
  const { isUserActive } = useUserActivityContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [chart, setChart] = useState<{
    options: ChartOptions<'line'>;
    data: ChartData<'line', { x: number; y: number }[], Date>;
  }>({ options: {}, data: { labels: [], datasets: [] } });
  const { projectId, service } = useServiceData();

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

  useEffect(() => {
    if (metricQuery.data) {
      setChart({
        options: {
          animation: {
            duration: 0,
          },
          backgroundColor: '#dddddd',
          // aspectRatio: 3,
          maintainAspectRatio: false,
          responsive: true,
          elements: {
            point: {
              radius: 0,
            },
            line: {
              tension: 0.4,
            },
          },
          scales: {
            y: {
              display: true,
              position: 'left',
              grid: {
                display: false,
              },
              ticks: {
                precision: 2,
              },
            },

            x: {
              type: 'time',
              position: 'bottom',
              grid: {
                display: false,
              },
              adapters: {
                date: {
                  locale: chartLocale,
                },
              },
              time: {
                tooltipFormat: 'Pp',
                displayFormats: {
                  hour: 'p',
                  minute: 'p',
                },
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: t(
                `metricName-${metricQuery.data.name}`,
                `${metricQuery.data.name} (${metricQuery.data.units})`,
              ),
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            // zoom: {
            //   zoom: {
            //     wheel: {
            //       enabled: true,
            //     },
            //     pinch: {
            //       enabled: true,
            //     },
            //     mode: 'xy',
            //   },
            //   pan: {
            //     enabled: true,
            //     mode: 'xy',
            //     threshold: 0,
            //   },
            //   limits: {
            //     x: { min: 'original', max: 'original' },
            //     y: { min: 'original', max: 'original' },
            //   },
            // },
          },
        },
        data: {
          datasets: metricQuery.data.metrics.map((hostMetric, idx) => ({
            label: hostMetric.hostname,
            data: hostMetric.dataPoints.map((dataPoint) => ({
              x: dataPoint.timestamp * 1000,
              y:
                metricQuery.data.units ===
                database.service.MetricUnitEnum.BYTES_PER_SECOND
                  ? dataPoint.value / 1000
                  : dataPoint.value,
            })),
            fill: true,
            borderWidth: 1,
            ...colors[idx % colors.length],
          })),
        },
      });
      setIsInitialized(true);
    }
  }, [metricQuery.data, chartLocale]);

  return (
    <>
      {metricQuery.isLoading ? (
        <div
          data-testid="metric-chart-loading-container"
          style={{ position: 'relative' }}
        >
          <div
            className={cn(
              'aspect-square sm:aspect-auto sm:h-[400px]',
              className,
            )}
          >
            <Line options={chart.options} data={chart.data} />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full justify-center text-white flex items-center bg-opacity-20 bg-black">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      ) : (
        isInitialized && (
          <div
            data-testid="metric-chart-container"
            className={cn(
              'aspect-square sm:aspect-auto sm:h-[400px]',
              className,
            )}
          >
            <Line options={chart.options} data={chart.data} />
          </div>
        )
      )}
    </>
  );
};

export default MetricChart;
