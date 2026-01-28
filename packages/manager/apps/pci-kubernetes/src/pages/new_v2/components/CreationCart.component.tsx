import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { Cart, TCartItem } from '@/components/cart/Cart.component';
import { selectMacroRegions } from '@/domain/services/regions.service';
import { TClusterPlanEnum } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { mapMacroRegionForCards } from '../view-models/regions.viewmodel';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add', NAMESPACES.REGION]);

  const form = useFormContext<TCreateClusterSchema>();
  const [
    nameField,
    macroRegionField,
    microRegionField,
    versionField,
    updatePolicyField,
    planField,
  ] = useWatch({
    control: form.control,
    name: [
      'name',
      'location.macroRegion',
      'location.microRegion',
      'version',
      'updatePolicy',
      'location.plan',
    ],
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
          {
            name: t('kube:kube_service_cluster_plan'),
            description: (
              <Text preset="heading-6">
                {t(`add:kube_add_plan_title_${planField ?? TClusterPlanEnum.STANDARD}`)}
              </Text>
            ),
          },
          ...(versionField && updatePolicyField
            ? [
                {
                  name: t('add:kubernetes_add_version_and_security_cart_title'),
                  description: (
                    <div className="flex flex-col gap-1">
                      <Text preset="heading-6">
                        {t('versions:pci_project_versions_list_version', { version: versionField })}
                      </Text>
                      <Text preset="heading-6">
                        {t(`service:kube_service_upgrade_policy_${updatePolicyField}`)}
                      </Text>
                    </div>
                  ),
                },
              ]
            : versionField
              ? [
                  {
                    name: t('add:kubernetes_add_version_title'),
                    description: (
                      <Text preset="heading-6">
                        {t('versions:pci_project_versions_list_version', { version: versionField })}
                      </Text>
                    ),
                  },
                ]
              : updatePolicyField
                ? [
                    {
                      name: t('service:kube_service_upgrade_policy'),
                      description: (
                        <Text preset="heading-6">
                          {t(`service:kube_service_upgrade_policy_${updatePolicyField}`)}
                        </Text>
                      ),
                    },
                  ]
                : []),
        ],
        expanded: true,
      },
    ];
  }, [
    macroRegionField,
    microRegionField,
    nameField,
    regions,
    t,
    planField,
    versionField,
    updatePolicyField,
  ]);

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};
