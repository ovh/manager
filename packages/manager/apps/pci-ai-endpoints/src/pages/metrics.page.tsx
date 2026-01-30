import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsDatepicker,
  OsdsText,
  OsdsSelect,
  OsdsSelectOption,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { addMonths, endOfDay, subMonths } from 'date-fns';
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

  const retentionPeriodMonths = 3;
  const defaultEndDateRef = useRef(endOfDay(new Date()));
  const defaultStartDateRef = useRef(
    subMonths(defaultEndDateRef.current, retentionPeriodMonths),
  );
  const hasInitialized = useRef(false);
  const maxDate = defaultEndDateRef.current;
  const minStartDate = subMonths(maxDate, retentionPeriodMonths);
  const displayStartTime = hasInitialized.current
    ? startTime
    : defaultStartDateRef.current;
  const displayEndTime = hasInitialized.current
    ? endTime
    : defaultEndDateRef.current;
  const maxEndDate = new Date(
    Math.min(
      maxDate.getTime(),
      addMonths(displayStartTime, retentionPeriodMonths).getTime(),
    ),
  );

  const metricsQuery = useGetMetrics(
    projectId,
    encodeURIComponent(displayStartTime.toISOString()),
    encodeURIComponent(displayEndTime.toISOString()),
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

  useEffect(() => {
    if (hasInitialized.current) return;

    if (endTime.getTime() !== defaultEndDateRef.current.getTime()) {
      handleEndTimeChange(defaultEndDateRef.current);
    }

    if (startTime.getTime() !== defaultStartDateRef.current.getTime()) {
      handleStartTimeChange(defaultStartDateRef.current);
    }

    hasInitialized.current = true;
  }, [endTime, startTime, handleEndTimeChange, handleStartTimeChange]);

  return (
    <>
      <div className="flex flex-col max-w-fit">
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
          <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row">
              <OsdsFormField className="flex lg:mr-8 max-lg:pb-4">
                <OsdsText slot="label" color={ODS_THEME_COLOR_INTENT.text}>
                  {t('ai_endpoints_startDate')}
                </OsdsText>
                <OsdsDatepicker
                  value={displayStartTime}
                  onOdsDatepickerValueChange={(v) =>
                    handleStartTimeChange(v.detail.value)
                  }
                  maxDate={displayEndTime}
                  minDate={minStartDate}
                  locale={localDatePicker}
                />
              </OsdsFormField>
              <OsdsFormField className="flex max-sm:pb-4">
                <OsdsText slot="label" color={ODS_THEME_COLOR_INTENT.text}>
                  {t('ai_endpoints_endDate')}
                </OsdsText>
                <OsdsDatepicker
                  value={displayEndTime}
                  onOdsDatepickerValueChange={(v) =>
                    handleEndTimeChange(v.detail.value)
                  }
                  maxDate={maxEndDate}
                  minDate={displayStartTime}
                  locale={localDatePicker}
                />
              </OsdsFormField>
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
            <div className="relative mt-12 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.default}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._600}
                  className="text-center"
                >
                  {t('ai_endpoints_noData')}
                </OsdsText>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              {filteredMetrics.map((metric, i) => (
                <Metric
                  key={metric.model}
                  projectId={projectId}
                  metric={metric.model}
                  startTime={displayStartTime}
                  endTime={displayEndTime}
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
