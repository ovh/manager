import { BILLING_TYPE } from '@/types/instance/common.type';
import { convertHourlyPriceToMonthly } from '@/utils';
import { TCartItem, TCartItemDetail } from '../hooks/useCartItems';

export type TCartTotals = {
  hourlyTotal: number | null;
  monthlyTotal: number | null;
};

export const STRICTLY_HOURLY_ITEMS = ['volume', 'network', 'publicNetwork'];

const isBilledHourly = (detail: TCartItemDetail) =>
  STRICTLY_HOURLY_ITEMS.includes(detail.id);

const sumPrices = (details: TCartItemDetail[]) =>
  details.reduce((sum, detail) => sum + (detail.price ?? 0), 0);

/**
 * Rules:
 * - Backups are always excluded from totals.
 * - Volume, network (gateway and its public IP) and public IP are always hourly.
 * - Flavor and image follow the billing type.
 */
export const calculateTotals = (
  items: TCartItem[],
  billingType: BILLING_TYPE,
): TCartTotals => {
  const detailsWithoutBackups = items.flatMap((item) =>
    item.details.filter((detail) => detail.id !== 'backup'),
  );

  switch (billingType) {
    case BILLING_TYPE.Hourly: {
      const hourlyTotal = sumPrices(detailsWithoutBackups);

      return {
        hourlyTotal,
        monthlyTotal: convertHourlyPriceToMonthly(hourlyTotal),
      };
    }

    case BILLING_TYPE.Monthly: {
      const hourlyItemsTotal = sumPrices(
        detailsWithoutBackups.filter(isBilledHourly),
      );
      const monthlyItemsTotal = sumPrices(
        detailsWithoutBackups.filter((detail) => !isBilledHourly(detail)),
      );

      return {
        hourlyTotal: null,
        monthlyTotal:
          monthlyItemsTotal + convertHourlyPriceToMonthly(hourlyItemsTotal),
      };
    }

    default:
      return { hourlyTotal: null, monthlyTotal: null };
  }
};
