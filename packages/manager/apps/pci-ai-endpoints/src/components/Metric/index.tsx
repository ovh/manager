import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Spinner, Text, Divider } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useGetMetric } from '@/hooks/api/database/metric/useGetMetric.hook';
import useGenerateMetricData from '@/hooks/metric/useGenerateMetricData.hook';
import useCalculateTotals from '@/hooks/metric/useCalculateTotal.hook';
import useChartData from '@/hooks/metric/useChartData.hook';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

type MetricProps = {
  projectId: string;
  metric: string;
  startTime: Date;
  endTime: Date;
  isFirstLoading: boolean;
};

const Metric: React.FC<MetricProps> = ({
  projectId,
  metric,
  startTime,
  endTime,
  isFirstLoading,
}) => {
  const encodedStartTime = useMemo(
    () => encodeURIComponent(startTime.toISOString()),
    [startTime],
  );
  const encodedEndTime = useMemo(
    () => encodeURIComponent(endTime.toISOString()),
    [endTime],
  );

  const { data: metricResponse, isLoading, isError } = useGetMetric(
    projectId,
    metric,
    encodedStartTime,
    encodedEndTime,
  );
  const { t } = useTranslation('metric');

  const { labels, dataMap } = useGenerateMetricData(
    startTime,
    endTime,
    metricResponse?.metrics,
  );

  const {
    totalInputTokens,
    totalOutputTokens,
    totalSeconds,
  } = useCalculateTotals(metricResponse?.metrics || []);

  const chartData = useChartData(dataMap, labels, isLoading, t);

  if (isLoading && isFirstLoading) {
    return (
      <div className="max-w-full mx-auto my-[9rem]">
        <div className="flex flex-col">
          <Text
            preset="heading-1"
            className="flex justify-center text-center text-[var(--ods-theme-primary-color)]"
          >
            {t('ai_endpoints_loading')}
          </Text>
          <div className="flex justify-center pt-8">
            <Spinner className="w-[3rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-full mx-auto my-[9rem]">
        <div className="flex flex-col">
          <Text
            preset="heading-1"
            className="flex justify-center text-center text-[var(--ods-theme-primary-color)]"
          >
            {t('ai_endpoints_error')}
          </Text>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div className="max-w-full mx-auto my-12 2xl:ml-0 2xl:mr-auto animate-fade-in">
      <Text
        preset="heading-2"
        className="text-[var(--ods-theme-primary-color)]"
      >
        {metric}
      </Text>
      <Divider />
      <div className="mt-4">
        {(totalInputTokens > 0 || totalOutputTokens > 0) && (
          <div className="flex flex-col">
            <Text
              preset="small"
              className="text-[var(--ods-color-neutral-500)]"
            >
              {`${t('ai_endpoints_total')} ${t(
                'ai_endpoints_input',
              )}: ${totalInputTokens.toLocaleString()}`}
            </Text>
            <Text
              preset="small"
              className=" pt-1 text-[var(--ods-color-neutral-500)]"
            >
              {`${t('ai_endpoints_total')} ${t(
                'ai_endpoints_output',
              )}: ${totalOutputTokens.toLocaleString()}`}
            </Text>
          </div>
        )}
        {totalSeconds > 0 && (
          <Text preset="paragraph">
            {`${t(
              'ai_endpoints_totalAudio',
            )}: ${totalSeconds.toLocaleString()}`}
          </Text>
        )}
      </div>
      <div className="pt-8 w-[90vw] 2xl:w-[45vw]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Metric;
