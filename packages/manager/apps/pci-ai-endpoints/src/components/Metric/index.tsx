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
import useGenerateLabels from '@/hooks/metric/useGenerateLabels.hook';
import useCalculateTotals from '@/hooks/metric/useCalculateTotal.hook';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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
  const { data: metricResponse, isLoading, isError } = useGetMetric(
    projectId,
    metric,
    encodeURIComponent(startTime.toISOString()),
    encodeURIComponent(endTime.toISOString()),
  );
  const { t } = useTranslation('metric');

  const { labels, dataMap } = useGenerateLabels(
    startTime,
    endTime,
    metricResponse?.metrics,
  );

  const {
    totalInputTokens,
    totalOutputTokens,
    totalSeconds,
  } = useCalculateTotals(metricResponse?.metrics || [], startTime, endTime);

  const chartData = useMemo(() => {
    if (!dataMap || Object.keys(dataMap).length === 0) return null;

    return {
      labels,
      datasets: Object.keys(dataMap).map((unit) => {
        let color = '';
        let label = '';

        switch (unit) {
          case 'input_tokens':
            color = '#0050D7';
            label = 'Input Tokens';
            break;
          case 'output_tokens':
            color = '#A5E9FF';
            label = 'Output Tokens';
            break;
          case 'seconds':
            color = '#0050D7';
            label = t('totalAudio');
            break;
          default:
            break;
        }

        return {
          label,
          data: dataMap[unit],
          borderColor: color,
          backgroundColor: color.replace('1)', '0.2)'),
          tension: 0.4,
        };
      }),
    };
  }, [dataMap, labels, t]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
      },
    }),
    [],
  );

  if (isLoading && isFirstLoading) {
    return (
      <div className="max-w-full mx-auto my-[150px]">
        <div className="flex flex-col">
          <OsdsText
            className="flex justify-center text-center"
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
          >
            {t('loading')}
          </OsdsText>
          <div className="flex justify-center pt-8">
            <OsdsSpinner className="w-[50px]" size={ODS_SPINNER_SIZE.sm} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-full mx-auto my-[150px]">
        <div className="flex flex-col">
          <OsdsText
            className="flex justify-center text-center"
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
          >
            {t('error')}
          </OsdsText>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div className="max-w-full mx-auto my-12 2xl:ml-0 2xl:mr-auto">
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
              {`${t(
                'total',
              )} Input Tokens: ${totalInputTokens.toLocaleString()}`}
            </OsdsText>
            <OsdsText className="pt-2">
              {`${t(
                'total',
              )} Output Tokens: ${totalOutputTokens.toLocaleString()}`}
            </OsdsText>
          </div>
        )}
        {totalSeconds > 0 && (
          <OsdsText>
            {`${t('totalAudio')}: ${totalSeconds.toLocaleString()}`}
          </OsdsText>
        )}
      </div>
      <div className="pt-8 w-[90vw] 2xl:w-[45vw]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Metric;
