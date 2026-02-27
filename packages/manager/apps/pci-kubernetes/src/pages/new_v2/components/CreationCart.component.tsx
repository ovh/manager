import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Cart, TCartItem } from '@/components/cart/Cart.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

export const CreationCart = () => {
  const { t } = useTranslation(['listing']);

  const form = useFormContext<TCreateClusterSchema>();
  const nameInput = useWatch<TCreateClusterSchema>({ name: 'name' });

  const cartItems = useMemo<Array<TCartItem>>(
    () => [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: nameInput,
        details: [],
        expanded: true,
      },
    ],
    [nameInput, t],
  );

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
