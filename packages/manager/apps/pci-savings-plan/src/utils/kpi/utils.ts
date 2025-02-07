import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

export const getPercentValue = (
  consumption: SavingsPlanFlavorConsumption,
  key: 'utilization' | 'coverage',
): string => {
  const values = consumption.periods
    .map((period) => parseFloat(period[key].replace('%', '')))
    .filter((value) => !Number.isNaN(value));

  if (!values.length) {
    return '';
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return `${Math.floor(average)}%`;
};
export const isCurrentPeriod = (period: string): boolean => {
  const now = new Date();
  const currentPeriod = now.toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  return period.toLowerCase() === currentPeriod.toLowerCase();
};
