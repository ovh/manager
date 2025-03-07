import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsDatepicker,
  OsdsText,
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';
import Metric from '@/components/Metric';
import { useDateLocale } from '@/hooks/metric/useDateLocale.hook';
import { MetricData } from '@/types/cloud/project/database/metric';
import getLocaleForDatePicker from '@/components//utils/getLocaleForDatepicker';

const PRIMARY_BORDER_COLOR = '#0050D7';

export default function MetricPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('metric');
  const [selectedModel, setSelectedModel] = useState<string>(
    t('ai_endpoints_allModel'),
  );

  const {
    timeZone,
    startTime,
    endTime,
    handleStartTimeChange,
    handleEndTimeChange,
  } = useDateLocale();

  const maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  );

  const metricsQuery = useGetMetrics(
    projectId,
    encodeURIComponent(startTime.toISOString()),
    encodeURIComponent(endTime.toISOString()),
  );

  const metricsData: MetricData[] = Array.isArray(metricsQuery.data)
    ? metricsQuery.data
    : [];

  const filteredMetrics: MetricData[] =
    selectedModel && selectedModel !== t('ai_endpoints_allModel')
      ? metricsData.filter(
          (metric: MetricData) => metric.model === selectedModel,
        )
      : metricsData;

  const localDatePicker = getLocaleForDatePicker();

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="flex mr-8 max-lg:pb-4">
            <OsdsSelect
              className="min-w-[250px] h-fit"
              value={selectedModel}
              onOdsValueChange={(v) => setSelectedModel(String(v.detail.value))}
            >
              <OsdsSelectOption value={t('ai_endpoints_allModel')}>
                {t('ai_endpoints_allModel')}
              </OsdsSelectOption>
              {metricsData.map((metric: MetricData) => (
                <OsdsSelectOption key={metric.model} value={metric.model}>
                  {metric.model}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex mr-8 max-lg:pb-4">
              <OsdsDatepicker
                value={startTime}
                onOdsDatepickerValueChange={(v) =>
                  handleStartTimeChange(v.detail.value)
                }
                maxDate={endTime}
                locale={localDatePicker}
              />
            </div>
            <div className="flex max-sm:pb-4">
              <OsdsDatepicker
                value={endTime}
                onOdsDatepickerValueChange={(v) =>
                  handleEndTimeChange(v.detail.value)
                }
                maxDate={maxDate}
                minDate={startTime}
                locale={localDatePicker}
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            className="pt-4 border-2 rounded-4 border-black"
          >{`Timezone: ${timeZone}`}</OsdsText>
        </div>
      </div>
      {Array.isArray(metricsQuery?.data) && (
        <>
          {metricsQuery.data.length === 0 ? (
            <div
              className="mt-[150px] flex justify-center rounded-[10px] w-[70vw] mx-auto"
              style={{
                border: `1px solid ${PRIMARY_BORDER_COLOR}`,
              }}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.primary}
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._600}
                className="p-8 text-center"
              >
                {t('ai_endpoints_noData')}
              </OsdsText>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              {filteredMetrics.map((metric, i) => (
                <Metric
                  key={metric.model}
                  projectId={projectId}
                  metric={metric.model}
                  startTime={startTime}
                  endTime={endTime}
                  isFirstLoading={i === 0}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
