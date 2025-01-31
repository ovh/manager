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
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { ODS_LOCALE } from '@ovhcloud/ods-common-core';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';
import Metric from '@/components/Metric';
import { useDateLocale } from '@/hooks/metric/useDateLocale.hook';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { MetricData } from '@/types/cloud/project/database/metric';

export default function MetricPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('metric');
  const [metricsData, setMetricsData] = useState<{ data: MetricData[] }>({
    data: [],
  });
  const [selectedModel, setSelectedModel] = useState<string>(t('allModel')); // Valeur par défaut "All Models"
  const locale = useDateFnsLocale();

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

  useEffect(() => {
    if (Array.isArray(metricsQuery?.data)) {
      setMetricsData({ data: metricsQuery.data });
    }
  }, [metricsQuery?.data]);

  const filteredMetrics =
    selectedModel && selectedModel !== t('allModel')
      ? metricsData.data.filter((metric) => metric.model === selectedModel)
      : metricsData.data;

  let localDatePicker;

  switch (locale.code) {
    case 'enGB':
      localDatePicker = ODS_LOCALE.EN;
      break;
    case 'fr':
      localDatePicker = ODS_LOCALE.FR;
      break;
    case 'frCA':
      localDatePicker = ODS_LOCALE.FR;
      break;
    case 'it':
      localDatePicker = ODS_LOCALE.IT;
      break;
    case 'de':
      localDatePicker = ODS_LOCALE.DE;
      break;
    case 'pl':
      localDatePicker = ODS_LOCALE.PL;
      break;
    case 'es':
      localDatePicker = ODS_LOCALE.ES;
      break;
    case 'pt':
      localDatePicker = ODS_LOCALE.PT;
      break;
    default:
      localDatePicker = ODS_LOCALE.EN;
      break;
  }

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
              <OsdsSelectOption value={t('allModel')}>
                {t('allModel')}
              </OsdsSelectOption>
              {metricsData?.data.map((metric) => (
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
                border: '1px solid #0050D7',
              }}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.primary}
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._600}
                className="p-8"
              >
                {t('noData')}
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
