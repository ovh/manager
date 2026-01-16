import { order } from '@/types/catalog';
import { Locale } from './useLocale';

interface UsePriceFormatterParams {
  locale: Locale;
  currency: order.CurrencyCodeEnum;
  decimals?: number;
}

export const usePriceFormatter = ({
  locale,
  currency,
  decimals,
}: UsePriceFormatterParams) => {
  const formatter = new Intl.NumberFormat(locale.replace('_', '-'), {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (value: number) => formatter.format(value);
};
