import { useEffect, useMemo, useState } from 'react';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';
import { getLastXMonths, toMonthYear } from '@/utils/formatter/date';
import { useSavingsPlanConsumption } from './useSavingsPlanConsumption';
import { getBigestConsumption, isInstanceFlavor } from '@/utils/savingsPlan';

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

  const setFilterByPlan = (consumptionFlavor: SavingsPlanFlavorConsumption) => {
    const defaultFlavor = consumptionFlavor.flavor;
    setFlavor(defaultFlavor);
  };

  useEffect(() => {
    if (consumption && consumption.flavors?.length > 0) {
      setFilterByPlan(getBigestConsumption(consumption.flavors));
    }
  }, [consumption]);

  const newFlavors = [
    ...new Set(consumption?.flavors?.map((f) => f.flavor.toLowerCase())),
  ];

  const flavorOptions = useMemo(() => {
    return newFlavors.length
      ? newFlavors
          ?.map((f) => ({
            label: f,
            value: f,
            prefix: isInstanceFlavor(f) ? 'Instance' : 'Rancher',
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
  }, [consumption]);

  const periodOptions = useMemo(
    () =>
      lastXMonths.map((date) => ({
        label: toMonthYear(new Date(date), locale),
        value: date,
      })),
    [lastXMonths],
  );

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
