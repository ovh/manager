import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { TInstanceCreationForm } from '@/pages/instances/create/CreateInstance.page';
import {
  Cart,
  TCartItem,
  TCartItemDetail,
} from '@/components/cart/Cart.component';
import { deps } from '@/deps/deps';
import {
  selectFlavorDetails,
  selectLocalisationDetails,
} from '../view-models/cartViewModel';
import { useProjectId } from '@/hooks/project/useProjectId';
import { FlavorDetails } from '@/pages/instances/create/components/cart/FlavorDetails.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

export const CreationCart = () => {
  const { t } = useTranslation(['common', 'creation', NAMESPACES.REGION]);
  const { getTextPrice } = useCatalogPrice(4);
  const projectId = useProjectId();
  const { control } = useFormContext<TInstanceCreationForm>();
  const [
    name,
    macroRegion,
    microRegion,
    availabilityZone,
    quantity,
    flavorId,
    distributionImageVariantId,
    distributionImageVersion,
    sshKeyId,
  ] = useWatch({
    control,
    name: [
      'name',
      'macroRegion',
      'microRegion',
      'availabilityZone',
      'quantity',
      'flavorId',
      'distributionImageVariantId',
      'distributionImageVersion',
      'sshKeyId',
    ],
  });

  const localizationDetails = selectLocalisationDetails(deps)(
    projectId,
    macroRegion,
    microRegion,
    availabilityZone,
  );

  const selectedFlavorDetails = selectFlavorDetails(deps)(
    projectId,
    flavorId,
    distributionImageVersion,
  );

  const itemDetails: TCartItemDetail[] = useMemo(() => {
    const regionDetails = localizationDetails
      ? [
          {
            name: t(`${NAMESPACES.REGION}:localisation`),
            description: (
              <Text preset="heading-6" className="text-[--ods-color-heading]">
                {`${localizationDetails.city} (${localizationDetails.datacenterDetails})`}
              </Text>
            ),
          },
        ]
      : [];

    const flavorDetails = selectedFlavorDetails
      ? [
          {
            name: t(
              'creation:pci_instance_creation_select_flavor_cart_section',
            ),
            description: (
              <>
                <FlavorDetails
                  quantity={quantity}
                  flavor={selectedFlavorDetails}
                />
                {selectedFlavorDetails.prices.hourlyPrice && (
                  <Text
                    preset="heading-6"
                    className="text-[--ods-color-heading]"
                  >
                    {getTextPrice(selectedFlavorDetails.prices.hourlyPrice)}
                  </Text>
                )}
              </>
            ),
          },
        ]
      : [];

    const distributionImageDetails =
      distributionImageVariantId &&
      distributionImageVersion.distributionImageVersionName
        ? [
            {
              name: t(
                'creation:pci_instance_creation_cart_distribution_image_title',
              ),
              description: (
                <>
                  <Text
                    preset="heading-6"
                    className="text-[--ods-color-heading]"
                  >
                    {distributionImageVersion.distributionImageVersionName}
                  </Text>
                  {selectedFlavorDetails?.prices.licencePrice && (
                    <Text
                      preset="heading-6"
                      className="text-[--ods-color-heading]"
                    >
                      {getTextPrice(selectedFlavorDetails.prices.licencePrice)}
                    </Text>
                  )}
                </>
              ),
            },
          ]
        : [];

    return [...regionDetails, ...flavorDetails, ...distributionImageDetails];
  }, [
    localizationDetails,
    t,
    selectedFlavorDetails,
    quantity,
    getTextPrice,
    distributionImageVariantId,
    distributionImageVersion.distributionImageVersionName,
  ]);

  const sshKeyDetails = useMemo(
    () =>
      sshKeyId
        ? [
            {
              name: t('common:pci_instances_common_ssh_key_label'),
              description: (
                <Text preset="heading-6" className="text-[--ods-color-heading]">
                  {sshKeyId}
                </Text>
              ),
            },
          ]
        : [],
    [sshKeyId, t],
  );

  const cartItems: TCartItem[] = useMemo(
    () => [
      {
        id: '0',
        title: t('pci_instances_common_instance_title'),
        name,
        details: [...itemDetails, ...sshKeyDetails],
        expanded: true,
      },
    ],
    [name, itemDetails, t, sshKeyDetails],
  );

  return <Cart items={cartItems} />;
};
