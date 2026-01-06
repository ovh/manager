import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { Cart, TCartItem } from '@/components/cart/Cart.component';
import { selectMacroRegions } from '@/domain/services/regions.service';
import { TClusterPlanEnum } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { mapMacroRegionForCards } from '../view-models/regions.viewmodel';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add', 'regions']);

  const form = useFormContext<TCreateClusterSchema>();
  const [nameField, macroRegionField, microRegionField, planField] = useWatch({
    control: form.control,
    name: ['name', 'location.macroRegion', 'location.microRegion', 'location.plan'],
  });

  const { data: regions } = useAvailabilityRegions({
    select: (regions) => mapMacroRegionForCards(selectMacroRegions(regions)),
  });

  const cartItems = useMemo<Array<TCartItem>>(() => {
    const selectedRegion = regions?.find(({ id }) => id === macroRegionField);
    const microRegionLabel = microRegionField ? ` (${microRegionField})` : '';
    const regionLabel = selectedRegion
      ? `${t(`regions:region_${selectedRegion.id}`)}${microRegionLabel}`
      : null;

    return [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: nameField,
        details: [
          {
            name: t('add:kubernetes_add_location'),
            description: regionLabel ? <Text preset="heading-6">{regionLabel}</Text> : undefined,
          },
          {
            name: t('kube:kube_service_cluster_plan'),
            description: (
              <Text preset="heading-6">
                {t(`add:kube_add_plan_title_${planField ?? TClusterPlanEnum.STANDARD}`)}
              </Text>
            ),
          },
        ],
        expanded: true,
      },
    ];
  }, [macroRegionField, microRegionField, nameField, planField, regions, t]);

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
