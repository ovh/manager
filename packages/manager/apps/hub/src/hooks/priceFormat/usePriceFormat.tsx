import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const usePriceFormat = (price: number, currency: string) => {
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();

  return currency && price
    ? Intl.NumberFormat(locale.replace('_', '-'), {
        style: 'currency',
        currency,
      }).format(price)
    : '';
};
