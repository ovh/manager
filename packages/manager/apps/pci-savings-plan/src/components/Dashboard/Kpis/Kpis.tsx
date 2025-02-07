import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsTooltip,
  OdsIcon,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isCurrentPeriod } from '@/utils/kpi/utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';
import { useKpiData } from '@/hooks/useKpiData';

const Kpi = ({
  title,
  value,
  valueSavedWithoutAmount,
  tooltip,
  index,
  isLoading,
}: {
  title: string;
  value: number | string;
  valueSavedWithoutAmount?: number | string;
  tooltip: string;
  index: number;
  isLoading: boolean;
}) => {
  const { t } = useTranslation('dashboard');
  if (isLoading)
    return (
      <div className="h-16 w-[200px] mx-2 flex flex-col justify-center">
        <OdsSkeleton />
      </div>
    );
  return (
    <div className="flex flex-col gap-2 w-auto">
      <OdsText preset="heading-5" className="max-w-lg">
        {title}
        <OdsIcon
          className="my-auto ml-2"
          aria-labelledby="tooltip-default"
          name="circle-question"
          id={`trigger-${index}`}
        />
        <OdsTooltip
          triggerId={`trigger-${index}`}
          id={`tooltip-default-${index}`}
        >
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            <span>{tooltip}</span>
          </OdsText>
        </OdsTooltip>
      </OdsText>
      <span className="text-[20px] font-bold mb-0 text-[#0050D7]">{value}</span>
      {valueSavedWithoutAmount && (
        <div className="flex items-center">
          <span className="text-[15px] mb-0 text-[#666ca1] mr-2">
            {t('dashboard_kpis_saved_strikethrough')}
          </span>
          <span className="line-through text-[15px] mb-0 text-[#666ca1]">
            {valueSavedWithoutAmount}
          </span>
        </div>
      )}
    </div>
  );
};

const Kpis = ({
  isLoading,
  consumption,
  period,
}: Readonly<{
  isLoading: boolean;
  consumption: SavingsPlanFlavorConsumption;
  period: string;
}>) => {
  const { t } = useTranslation('dashboard');
  const computedPercents = useKpiData(consumption);
  const isCurrentMonth = useMemo(() => isCurrentPeriod(period), [period]);

  const kpiData = [
    {
      title: t('dashboard_kpis_active_plans_name'),
      tooltip: t('dashboard_kpis_active_plans_tooltip'),
      value: computedPercents.computedActivePlans,
    },
    {
      title: t('dashboard_kpis_usage_percent_name'),
      tooltip: t('dashboard_kpis_usage_percent_tooltip'),
      value: computedPercents.computedUsagePercent,
    },
    {
      title: t('dashboard_kpis_coverage_percent_name'),
      tooltip: t('dashboard_kpis_coverage_percent_tooltip'),
      value: computedPercents.computedCoveragePercent,
    },
    ...(!isCurrentMonth
      ? [
          {
            title: t('dashboard_kpis_saved_amount_name'),
            tooltip: t('dashboard_kpis_saved_amount_name_tooltip'),
            value: computedPercents.computedSavedAmount,
            valueSavedWithoutAmount:
              computedPercents.computedWithoutSavedAmount,
          },
          {
            title: t('dashboard_kpis_amount_outiside'),
            tooltip: t('dashboard_kpis_amount_outiside_tooltip'),
            value: computedPercents.computedSavedAmount,
            valueSavedWithoutAmount:
              computedPercents.computedWithoutSavedAmount,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-row gap-4 items-center mt-7">
      {kpiData.map((item, index) => (
        <React.Fragment key={item.title}>
          <Kpi
            title={item.title}
            value={item.value}
            tooltip={item.tooltip}
            index={index}
            isLoading={isLoading}
            valueSavedWithoutAmount={item.valueSavedWithoutAmount}
          />
          {index < kpiData.length - 1 && (
            <div className="h-16 w-px bg-gray-300 mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Kpis;
