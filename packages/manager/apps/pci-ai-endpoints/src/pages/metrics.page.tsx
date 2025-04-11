import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsDatepicker,
  OsdsText,
  OsdsSelect,
  OsdsSelectOption,
  OsdsFormField,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';
import Metric from '@/components/Metric';
import { useDateLocale } from '@/hooks/metric/useDateLocale.hook';
import { MetricData } from '@/types/cloud/project/database/metric';
import getLocaleForDatePicker from '@/components//utils/getLocaleForDatepicker';

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
      <div className="flex flex-col max-w-fit">
        {Array.isArray(metricsQuery?.data) && (
          <>
            {metricsQuery.data.length === 0 && (
              <OsdsMessage
                type={ODS_MESSAGE_TYPE.info}
                className="mb-6 max-w-[902px]"
              >
                <OsdsText
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('ai_endpoints_no_data_for_the_selected_period')}
                </OsdsText>
              </OsdsMessage>
            )}
          </>
        )}
        <div className="flex flex-col md:flex-row">
          <div className="flex mr-8 max-lg:pb-4">
            <OsdsFormField>
              <OsdsText slot="label" color={ODS_THEME_COLOR_INTENT.text}>
                {t('ai_endpoints_models')}
              </OsdsText>
              <OsdsSelect
                id="model"
                className="min-w-[250px] h-fit"
                value={selectedModel}
                onOdsValueChange={(v) =>
                  setSelectedModel(String(v.detail.value))
                }
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
            </OsdsFormField>
          </div>
          <div className="flex flex-col lg:flex-row">
            <OsdsFormField className="flex lg:mr-8 max-lg:pb-4">
              <OsdsText slot="label" color={ODS_THEME_COLOR_INTENT.text}>
                {t('ai_endpoints_startDate')}
              </OsdsText>
              <OsdsDatepicker
                value={startTime}
                onOdsDatepickerValueChange={(v) =>
                  handleStartTimeChange(v.detail.value)
                }
                maxDate={endTime}
                locale={localDatePicker}
              />
            </OsdsFormField>
            <OsdsFormField className="flex max-sm:pb-4">
              <OsdsText slot="label" color={ODS_THEME_COLOR_INTENT.text}>
                {t('ai_endpoints_endDate')}
              </OsdsText>
              <OsdsDatepicker
                value={endTime}
                onOdsDatepickerValueChange={(v) =>
                  handleEndTimeChange(v.detail.value)
                }
                maxDate={maxDate}
                minDate={startTime}
                locale={localDatePicker}
              />
            </OsdsFormField>
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
            <div className="mt-[150px] flex justify-center w-[70vw] mx-auto">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.default}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._600}
                className=" text-center"
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
