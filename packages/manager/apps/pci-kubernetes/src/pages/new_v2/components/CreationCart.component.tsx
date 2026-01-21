import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { Cart, TCartItem } from '@/components/cart/Cart.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { mapMacroRegionForCards, selectMacroRegions } from '../view-models/location.viewmodel';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add', NAMESPACES.REGION]);

  const form = useFormContext<TCreateClusterSchema>();
  const [nameField, macroRegionField, microRegionField] = useWatch({
    control: form.control,
    name: ['name', 'location.macroRegion', 'location.microRegion'],
  });

  const { data: regions } = useAvailabilityRegions({
    select: (regions) => mapMacroRegionForCards(selectMacroRegions(regions)),
  });

  const cartItems = useMemo<Array<TCartItem>>(() => {
    const selectedRegion = regions?.find(({ id }) => id === macroRegionField);
    return [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: nameField,
        details: [
          {
            name: t('add:kubernetes_add_location'),
            description: selectedRegion ? (
              <Text preset="heading-6">{`${t(`${NAMESPACES.REGION}:region_${selectedRegion.id}_micro`, { micro: microRegionField })}`}</Text>
            ) : undefined,
          },
        ],
        expanded: true,
      },
    ];
  }, [macroRegionField, microRegionField, nameField, regions, t]);

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
