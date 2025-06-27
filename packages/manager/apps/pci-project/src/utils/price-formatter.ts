import { Currency } from '@ovh-ux/manager-config';
import { LANGUAGE_OVERRIDE } from '@/payment/constants';

export const formatPrice = (
  price: number,
  currency: Currency,
  ovhSubsidiary: string,
): string => {
  return new Intl.NumberFormat(
    LANGUAGE_OVERRIDE[ovhSubsidiary as keyof typeof LANGUAGE_OVERRIDE] ||
      ovhSubsidiary.toLowerCase(),
    {
      style: 'currency',
      currency: currency.code,
    },
  ).format(price ?? 0);
};
