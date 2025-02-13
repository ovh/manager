import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsTooltip,
  OdsIcon,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { usePricing } from '@ovh-ux/manager-pci-common';
import { getPercentValue, isCurrentPeriod } from '@/utils/kpi/utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

const Kpi = ({
  title,
  value,
  valueWithoutAmount,
  tooltip,
  index,
  isLoading,
}: {
  title: string;
  value: string | number;
  valueWithoutAmount?: string | number;
  tooltip: string;
  index: number;
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <div className="h-16 w-[250px] mx-2 flex flex-col justify-center">
        <OdsSkeleton />
      </div>
    );
  return (
    <div className="flex flex-col gap-2 w-auto">
      <OdsText preset="heading-5" className="max-w-lg whitespace-no-wrap">
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
      {!!value && !!valueWithoutAmount && (
        <div className="flex items-center">
          <span className="text-[15px] mb-0 text-[#666ca1] mr-2">
            <Trans
              i18nKey="dashboard:dashboard_kpis_saved_strikethrough"
              values={{ pricing: valueWithoutAmount }}
              components={{
                price: (
                  <span className="line-through text-[15px] mb-0 text-[#666ca1]" />
                ),
              }}
            />
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
  consumption: SavingsPlanFlavorConsumption | null | undefined;
  period: string;
}>) => {
  const currentDate = new Date(period);

  const isCurrentMonth = useMemo(() => isCurrentPeriod(currentDate), [
    currentDate,
  ]);
  const { formatPrice } = usePricing();
  const { t } = useTranslation('dashboard');

  const getFormattedFee = useCallback(
    (fee: number | undefined): string | number => {
      if (!fee || fee <= 0) return null;
      return formatPrice(fee, { decimals: 2, unit: 1 });
    },
    [formatPrice],
  );

  const formatKpiValue = useCallback(
    (value: number | string, percentage: boolean): string => {
      if (!value) {
        return t('dashboard_kpis_not_available');
      }
      return percentage ? `${value} %` : value.toString();
    },
    [t],
  );

  const savedAmount = useMemo(
    () => getFormattedFee(consumption?.fees?.saved_amount),
    [consumption, getFormattedFee],
  );

  const withoutSavedAmount = useMemo(
    () =>
      getFormattedFee(
        consumption?.fees?.saved_amount + consumption?.fees?.total_price,
      ),
    [consumption, getFormattedFee],
  );

  const totalActivePlans = useMemo(() => consumption?.subscriptions?.length, [
    consumption,
  ]);

  const usage = useMemo(
    () => getPercentValue(consumption?.periods?.map((p) => p.utilization)),
    [consumption],
  );

  const coverage = useMemo(
    () => getPercentValue(consumption?.periods?.map((p) => p.coverage)),
    [consumption],
  );

  const totalAmountOutside = useMemo(
    () => getFormattedFee(consumption?.fees?.over_quota?.total_price),
    [consumption, getFormattedFee],
  );

  const kpiData = [
    {
      title: t('dashboard_kpis_active_plans_name'),
      tooltip: t('dashboard_kpis_active_plans_tooltip'),
      value: formatKpiValue(totalActivePlans, false),
    },
    {
      title: t('dashboard_kpis_usage_percent_name'),
      tooltip: t('dashboard_kpis_usage_percent_tooltip'),
      value: formatKpiValue(usage, true),
    },
    {
      title: t('dashboard_kpis_coverage_percent_name'),
      tooltip: t('dashboard_kpis_coverage_percent_tooltip'),
      value: formatKpiValue(coverage, true),
    },
    ...(!isCurrentMonth
      ? [
          {
            title: t('dashboard_kpis_saved_amount_name'),
            tooltip: t('dashboard_kpis_saved_amount_name_tooltip'),
            value: formatKpiValue(savedAmount, false),
            valueWithoutAmount: withoutSavedAmount,
          },
          {
            title: t('dashboard_kpis_non_discounted_name'),
            tooltip: t('dashboard_kpis_non_discounted_tooltip'),
            value: formatKpiValue(totalAmountOutside, false),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-row gap-4 mt-7">
      {kpiData.map((item, index) => (
        <React.Fragment key={item.title}>
          <Kpi
            title={item.title}
            value={item.value}
            tooltip={item.tooltip}
            index={index}
            isLoading={isLoading}
            valueWithoutAmount={item.valueWithoutAmount}
          />
          {index < kpiData.length - 1 && (
            <div className="h-30 w-px bg-gray-300 mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Kpis;
