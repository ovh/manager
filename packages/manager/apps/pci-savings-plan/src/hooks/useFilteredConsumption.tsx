import { useEffect, useMemo, useState } from 'react';
import { getLastXMonths, toMonthYear } from '@/utils/formatter/date';
import { useSavingsPlanConsumption } from './useSavingsPlanConsumption';
import { isInstanceFlavor } from '@/utils/savingsPlan';
import { getTotalActivePlans } from '@/utils/kpi/utils';

export const useFilteredConsumption = (locale: string) => {
  const lastXMonths = useMemo(() => getLastXMonths(), []);
  const [period, setPeriod] = useState(lastXMonths[0]);
  const [flavor, setFlavor] = useState('');

  const month = new Date(period).getMonth() + 1;
  const year = new Date(period).getFullYear();

  const {
    data: consumption,
    isLoading: isConsumptionLoading,
  } = useSavingsPlanConsumption({
    year,
    month,
  });

  const flavorsSize =
    consumption?.flavors
      ?.map((f) => ({
        flavor: f.flavor.toLowerCase(),
        totalActivePlans: getTotalActivePlans(f),
      }))
      .sort((a, b) => b.totalActivePlans - a.totalActivePlans) ?? [];

  const flavorOptions = useMemo(() => {
    return flavorsSize.map((f) => ({
      label: f.flavor,
      value: f.flavor,
      prefix: isInstanceFlavor(f.flavor) ? 'Instance' : 'Rancher',
    }));
  }, [consumption]);

  const periodOptions = useMemo(
    () =>
      lastXMonths.map((date) => ({
        label: toMonthYear(new Date(date), locale),
        value: date,
      })),
    [lastXMonths],
  );

  useEffect(() => {
    if (flavorOptions && flavorOptions.length > 0) {
      setFlavor(flavorOptions[0].value);
    }
  }, [flavorOptions]);

  return {
    consumption,
    isConsumptionLoading,
    flavor,
    period,
    periodOptions,
    flavorOptions,
    setFlavor,
    setPeriod,
  };
};
