import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePricing } from '@ovh-ux/manager-pci-common';
import { getPercentValue } from '@/utils/kpi/utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

interface ComputedPercents {
  computedUsagePercent: number | string;
  computedCoveragePercent: number | string;
  computedActivePlans: number | string;
  computedSavedAmount: number | string;
  computedWithoutSavedAmount?: number | string | null;
}

enum Period {
  utilization = 'utilization',
  coverage = 'coverage',
}

export const useKpiData = (
  consumption: SavingsPlanFlavorConsumption,
): ComputedPercents => {
  const { formatPrice } = usePricing();
  const { t } = useTranslation('dashboard');
  const defaultMessage = t('dashboard_kpis_not_available');

  return useMemo(() => {
    const { saved_amount: rawSavedAmount = 0, total_price: rawTotalPrice = 0 } =
      consumption.fees ?? {};
    const savedAmount = Number(rawSavedAmount);
    const totalPrice = Number(rawTotalPrice);
    const totalActivePlans = consumption?.subscriptions?.length;

    const totalAmountWithoutSavingsPlans =
      Math.min(savedAmount, totalPrice) <= 0 ? 0 : savedAmount + totalPrice;

    const formattedTotalAmountSavedWithSavingsPlans =
      savedAmount > 0
        ? formatPrice(savedAmount, { decimals: 2, unit: 1 })
        : defaultMessage;

    const formattedTotalAmountWithoutSavingsPlans =
      totalAmountWithoutSavingsPlans > 0
        ? formatPrice(totalAmountWithoutSavingsPlans, { decimals: 2, unit: 1 })
        : null;

    if (!consumption?.periods?.length) {
      return {
        computedUsagePercent: defaultMessage,
        computedCoveragePercent: defaultMessage,
        computedActivePlans: defaultMessage,
        computedSavedAmount: defaultMessage,
        computedWithoutSavedAmount: null,
      };
    }

    return {
      computedUsagePercent:
        getPercentValue(consumption, Period.utilization) || defaultMessage,
      computedCoveragePercent:
        getPercentValue(consumption, Period.coverage) || defaultMessage,
      computedActivePlans: totalActivePlans || defaultMessage,
      computedSavedAmount: formattedTotalAmountSavedWithSavingsPlans,
      computedWithoutSavedAmount: formattedTotalAmountWithoutSavingsPlans,
    };
  }, [consumption, formatPrice, defaultMessage, t]);
};
