import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { useCloudCatalog } from '@/api/hooks/useCloudCatalog';
import { Cart, TCartItem } from '@/components/cart/Cart.component';
import { selectMacroRegions } from '@/domain/services/regions.service';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { selectPlanPrices } from '../view-models/plans.viewmodel';
import { mapMacroRegionForCards } from '../view-models/regions.viewmodel';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add', 'regions']);

  const form = useFormContext<TCreateClusterSchema>();
  const [nameField, macroRegionField, microRegionField, deploymentModeField, planTypeField] =
    useWatch({
      control: form.control,
      name: [
        'name',
        'location.macroRegion',
        'location.microRegion',
        'location.deploymentMode',
        'planType',
      ],
    });

  const { data: regions } = useAvailabilityRegions({
    select: (regions) => mapMacroRegionForCards(selectMacroRegions(regions)),
  });

  const { data: planPrices } = useCloudCatalog({
    select: selectPlanPrices(deploymentModeField === 'region-3-az', planTypeField),
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
            description: planTypeField ? (
              <Text preset="heading-6">{t(`add:kube_add_plan_title_${planTypeField}`)}</Text>
            ) : undefined,
            price: planPrices?.hourlyPrice ? planPrices.hourlyPrice : undefined,
          },
        ],
        expanded: true,
      },
    ];
  }, [macroRegionField, microRegionField, nameField, planTypeField, planPrices, regions, t]);

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
