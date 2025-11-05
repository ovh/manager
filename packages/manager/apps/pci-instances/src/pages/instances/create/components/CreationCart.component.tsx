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

export const CreationCart = () => {
  const { t } = useTranslation(['common', 'creation']);
  const projectId = useProjectId();
  const { control } = useFormContext<TInstanceCreationForm>();
  const [
    name,
    macroRegion,
    microRegion,
    availabilityZone,
    quantity,
    flavorId,
    distributionImageName,
  ] = useWatch({
    control,
    name: [
      'name',
      'macroRegion',
      'microRegion',
      'availabilityZone',
      'quantity',
      'flavorId',
      'distributionImageName',
    ],
  });

  const localizationDetails = selectLocalisationDetails(deps)(
    projectId,
    macroRegion,
    microRegion,
    availabilityZone,
  );

  const selectedFlavorDetails = selectFlavorDetails(deps)(projectId, flavorId);

  const itemDetails: TCartItemDetail[] = useMemo(() => {
    const regionDetails = localizationDetails
      ? [
          {
            name: t('localisation'),
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
              <FlavorDetails
                quantity={quantity}
                flavor={selectedFlavorDetails}
              />
            ),
          },
        ]
      : [];

    const distributionImageDetails = distributionImageName
      ? [
          {
            name: t(
              'creation:pci_instance_creation_cart_distribution_image_title',
            ),
            description: (
              <Text preset="heading-6" className="text-[--ods-color-heading]">
                {distributionImageName} - version x
              </Text>
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
    distributionImageName,
  ]);

  const cartItems: TCartItem[] = useMemo(
    () => [
      {
        id: '0',
        title: t('pci_instances_common_instance_title'),
        name,
        details: itemDetails,
        expanded: true,
      },
    ],
    [name, itemDetails, t],
  );

  return <Cart items={cartItems} />;
};
