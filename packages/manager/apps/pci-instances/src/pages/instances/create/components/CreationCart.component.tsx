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
import { FlavorDetails } from '@/pages/instances/create/components/cart/FlavorDetails.component';

export const CreationCart = () => {
  const { t } = useTranslation(['common', 'creation']);
  const { control } = useFormContext<TInstanceCreationForm>();
  const [name, macroRegion, availabilityZone, quantity, flavor] = useWatch({
    control,
    name: ['name', 'macroRegion', 'availabilityZone', 'quantity', 'flavor'],
  });

  const itemDetails: TCartItemDetail[] = useMemo(() => {
    const regionDetails = {
      name: t(
        'creation:pci_instance_creation_select_localization_cart_section',
      ),
      description: (
        <Text className="font-semibold text-[--ods-color-heading]">
          {macroRegion} {availabilityZone && `(${availabilityZone})`}
        </Text>
      ),
    };

    const flavorDetails = {
      name: t('creation:pci_instance_creation_select_flavor_cart_section'),
      description: <FlavorDetails quantity={quantity} flavor={flavor} />,
    };

    return [regionDetails, flavorDetails];
  }, [macroRegion, availabilityZone, quantity, flavor, t]);

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
