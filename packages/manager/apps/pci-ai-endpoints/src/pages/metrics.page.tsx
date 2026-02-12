import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
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
  return (
    <>
      <div className="flex flex-col max-w-fit">
        {Array.isArray(metricsQuery?.data) && (
          <>
            {metricsQuery.data.length === 0 && (
              <Message
                color={MESSAGE_COLOR.information}
                className="mb-6 max-w-[902px]"
              >
                <MessageIcon name="circle-info" />
                <MessageBody>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t('ai_endpoints_no_data_for_the_selected_period')}
                  </Text>
                </MessageBody>
              </Message>
            )}
          </>
        )}
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
          <div className="flex flex-col lg:flex-row">
            <FormField className="flex lg:mr-8 max-lg:pb-4">
              <Text preset={TEXT_PRESET.small}>
                {t('ai_endpoints_startDate')}
              </Text>
              <Datepicker
                value={startTime}
                max={endTime}
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
                value={endTime}
                locale={localDatePicker}
                max={maxDate}
                min={startTime}
                onValueChange={(v) => handleEndTimeChange(v.value)}
              >
                <DatepickerControl />
                <DatepickerContent />
              </Datepicker>
            </FormField>
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
            <div className="mt-[150px] flex justify-center w-[70vw] mx-auto">
              <Text
                preset={TEXT_PRESET.label}
                className="text-center text-[var(--ods-theme-neutral-color)]"
              >
                {t('ai_endpoints_noData')}
              </Text>
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
