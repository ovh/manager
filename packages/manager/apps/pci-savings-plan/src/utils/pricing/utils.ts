import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';
import { getDiffInPercent } from '@/components/Commitment/Commitment.utils';
import { CENTS_PRICE } from '../commercial-catalog/utils';
import { TPricingInfo } from '@/hooks/useCatalogCommercial';

export const getPlanPricing = ({
  pricing,
  quantity,
  hourlyPriceWithoutDiscount,
}: {
  pricing: TPricingInfo;
  quantity: number;
  hourlyPriceWithoutDiscount: number;
}) => {
  const { price, duration } = pricing;
  const priceByMonthWithoutCommitment =
    convertHourlyPriceToMonthly(hourlyPriceWithoutDiscount) * quantity;

  const priceNumber = Number(price) * quantity;

  const diffInPercent = getDiffInPercent(
    priceByMonthWithoutCommitment,
    priceNumber,
  );

  return {
    ...pricing,
    duration: duration ?? 0,
    monthlyPercentageDiscount: diffInPercent,
    monthlyPrice: priceNumber * CENTS_PRICE,
    monthlyPriceWithoutDiscount: priceByMonthWithoutCommitment * CENTS_PRICE,
  };
};
