import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TEXT_PRESET,
  Text,
  FormField,
  Datepicker,
  DatepickerControl,
  DatepickerContent,
  Select,
  SelectControl,
  SelectContent,
} from '@ovhcloud/ods-react';
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
  const allModelsItems = [
    {
      label: t('ai_endpoints_allModel'),
      value: t('ai_endpoints_allModel'),
    },
    ...metricsData.map((metric: MetricData) => ({
      label: metric.model,
      value: metric.model,
    })),
  ];

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
            <FormField>
              <Text preset={TEXT_PRESET.small}>{t('ai_endpoints_models')}</Text>
              <Select
                defaultValue={t('ai_endpoints_allModel')}
                className="min-w-[250px] h-fit"
                items={allModelsItems}
                onValueChange={(v) => setSelectedModel(String(v.value))}
              >
                <SelectControl />
                <SelectContent />
              </Select>
            </FormField>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row">
              <FormField className="flex lg:mr-8 max-lg:pb-4">
                <Text preset={TEXT_PRESET.small}>
                  {t('ai_endpoints_startDate')}
                </Text>
                <Datepicker
                  value={displayStartTime}
                  max={displayEndTime}
                  min={minStartDate}
                  locale={localDatePicker}
                  onValueChange={(v) => handleStartTimeChange(v.value)}
                >
                  <DatepickerControl />
                  <DatepickerContent />
                </Datepicker>
              </FormField>
              <FormField className="flex max-sm:pb-4">
                <Text preset={TEXT_PRESET.small}>
                  {t('ai_endpoints_endDate')}
                </Text>
                <Datepicker
                  value={displayEndTime}
                  locale={localDatePicker}
                  max={maxEndDate}
                  min={displayStartTime}
                  onValueChange={(v) => handleEndTimeChange(v.value)}
                >
                  <DatepickerControl />
                  <DatepickerContent />
                </Datepicker>
              </FormField>
            </div>
          </div>
        </div>
        <div className="flex">
          <Text
            preset={TEXT_PRESET.small}
            className="pt-4 border-2 rounded-4  text-[var(--ods-theme-primary-color)]"
          >{`Timezone: ${timeZone}`}</Text>
        </div>
      </div>
      {Array.isArray(metricsQuery?.data) && (
        <>
          {metricsQuery.data.length === 0 ? (
            <div className="relative mt-12 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <Text
                  preset={TEXT_PRESET.label}
                  className="text-center text-[var(--ods-theme-neutral-color)]"
                >
                  {t('ai_endpoints_noData')}
                </Text>
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
