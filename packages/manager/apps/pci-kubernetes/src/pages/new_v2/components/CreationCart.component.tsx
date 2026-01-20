import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Cart, TCartItem } from '@/components/cart/Cart.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { MOCK_REGIONS } from '../mocks/regions.mock';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add']);

  const form = useFormContext<TCreateClusterSchema>();
  const [nameField, macroRegionField, microRegionField] = useWatch({
    control: form.control,
    name: ['name', 'location.macroRegion', 'location.microRegion'],
  });

  // TODO (TAPC-5549) : mock format, will be updated or removed
  const cartItems = useMemo<Array<TCartItem>>(() => {
    const selectedRegion = MOCK_REGIONS.find(({ id }) => id === macroRegionField);
    return [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: nameField,
        details: [
          {
            name: t('add:kubernetes_add_location'),
            description: selectedRegion ? (
              <Text preset="heading-6">{`${selectedRegion.title} (${microRegionField})`}</Text>
            ) : undefined,
          },
        ],
        expanded: true,
      },
    ];
  }, [macroRegionField, microRegionField, nameField, t]);

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
