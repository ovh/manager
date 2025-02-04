import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

export const calculateAverageUsage = (
  flavor: SavingsPlanFlavorConsumption,
): number | null => {
  const utilizationValues = flavor.periods
    .map(({ utilization }) => parseFloat(utilization.replace('%', '')))
    .filter((value) => !Number.isNaN(value));

  return utilizationValues.length
    ? utilizationValues.reduce((sum, value) => sum + value, 0) /
        utilizationValues.length
    : null;
};

export const getUsagePercent = (consumption: SavingsPlanFlavorConsumption) =>
  consumption?.periods?.length ? calculateAverageUsage(consumption) : null;

export const formatUsagePercent = (
  usagePercent: number | null,
  message: string,
) => (usagePercent ? `${Math.floor(usagePercent)}%` : message);
