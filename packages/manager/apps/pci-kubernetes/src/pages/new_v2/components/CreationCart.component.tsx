import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Cart, TCartItem } from '@/components/cart/Cart.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add']);

  const form = useFormContext<TCreateClusterSchema>();
  const [nameField, macroRegionField, microRegionField] = useWatch<TCreateClusterSchema>({
    name: ['name', 'macroRegion', 'microRegion'],
  });

  const cartItems = useMemo<Array<TCartItem>>(
    () => [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: nameField,
        details: [
          {
            name: t('add:kubernetes_add_location'),
            description: (
              // TODO (TAPC-5549) : Use macroRegion key to display the full region name
              <Text preset="heading-6">{`${macroRegionField} (${microRegionField})`}</Text>
            ),
          },
        ],
        expanded: true,
      },
    ],
    [macroRegionField, microRegionField, nameField, t],
  );

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
