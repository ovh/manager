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
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsSpinner,
  OsdsText,
  OsdsDivider,
} from '@ovhcloud/ods-components/react';
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
          <OsdsText
            className="flex justify-center text-center"
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
          >
            {t('ai_endpoints_loading')}
          </OsdsText>
          <div className="flex justify-center pt-8">
            <OsdsSpinner className="w-[3rem]" size={ODS_SPINNER_SIZE.sm} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-full mx-auto my-[9rem]">
        <div className="flex flex-col">
          <OsdsText
            className="flex justify-center text-center"
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
          >
            {t('ai_endpoints_error')}
          </OsdsText>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div className="max-w-full mx-auto my-12 2xl:ml-0 2xl:mr-auto animate-fade-in">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._600}
      >
        {metric}
      </OsdsText>
      <OsdsDivider
        className="flex"
        color={ODS_THEME_COLOR_INTENT.default}
        separator={true}
      />
      <div>
        {(totalInputTokens > 0 || totalOutputTokens > 0) && (
          <div className="flex flex-col">
            <OsdsText>
              {`${t('ai_endpoints_total')} ${t(
                'ai_endpoints_input',
              )}: ${totalInputTokens.toLocaleString()}`}
            </OsdsText>
            <OsdsText className="pt-2">
              {`${t('ai_endpoints_total')} ${t(
                'ai_endpoints_output',
              )}: ${totalOutputTokens.toLocaleString()}`}
            </OsdsText>
          </div>
        )}
        {totalSeconds > 0 && (
          <OsdsText>
            {`${t(
              'ai_endpoints_totalAudio',
            )}: ${totalSeconds.toLocaleString()}`}
          </OsdsText>
        )}
      </div>
      <div className="pt-8 w-[90vw] 2xl:w-[45vw]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Metric;
