import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsTooltip,
  OdsIcon,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPercentValue } from '@/utils/kpi/utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

const Kpi = ({
  title,
  value,
  tooltip,
  index,
  isLoading,
}: {
  title: string;
  value: number | string;
  tooltip: string;
  index: number;
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <div className="h-16 w-[200px] mx-2 flex flex-col justify-center">
        <OdsSkeleton />
      </div>
    );
  return (
    <div className="flex flex-col gap-2 w-[200px]">
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
    </div>
  );
};

const Kpis = ({
  isLoading,
  consumption,
}: Readonly<{
  isLoading: boolean;
  consumption: SavingsPlanFlavorConsumption;
}>) => {
  const { t } = useTranslation('dashboard');
  const defaultMessage = t('dashboard_kpis_not_available');

  const computedPercents = useMemo(() => {
    if (!consumption.periods?.length) {
      return {
        computedUsagePercent: defaultMessage,
        computedCoveragePercent: defaultMessage,
      };
    }
    return {
      computedUsagePercent:
        getPercentValue(consumption, 'utilization') || defaultMessage,
      computedCoveragePercent:
        getPercentValue(consumption, 'coverage') || defaultMessage,
    };
  }, [consumption, defaultMessage]);

  const { computedUsagePercent, computedCoveragePercent } = computedPercents;

  const kpiData = [
    {
      title: t('dashboard_kpis_active_plans_name'),
      tooltip: t('dashboard_kpis_active_plans_tooltip'),
      value: 5,
    },
    {
      title: t('dashboard_kpis_usage_percent_name'),
      tooltip: t('dashboard_kpis_usage_percent_tooltip'),
      value: computedUsagePercent,
    },
    {
      title: t('dashboard_kpis_coverage_percent_name'),
      tooltip: t('dashboard_kpis_coverage_percent_tooltip'),
      value: computedCoveragePercent,
    },
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
