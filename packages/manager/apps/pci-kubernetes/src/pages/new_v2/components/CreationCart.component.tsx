import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Cart, TCartItem } from '@/components/cart/Cart.component';

export const CreationCart = () => {
  const { t } = useTranslation(['listing']);

  const cartItems = useMemo<Array<TCartItem>>(
    () => [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: 'cluster_name',
        details: [],
        expanded: true,
      },
    ],
    [t],
  );

  return <Cart items={cartItems} />;
};
