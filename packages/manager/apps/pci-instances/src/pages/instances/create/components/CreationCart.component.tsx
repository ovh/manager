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

export const CreationCart = () => {
  const { t } = useTranslation('common');
  const { control } = useFormContext<TInstanceCreationForm>();
  const [name, region] = useWatch({
    control,
    name: ['name', 'region'],
  });

  const itemDetails: TCartItemDetail[] = useMemo(() => {
    const regionDetails = {
      name: t('localisation'),
      description: (
        <Text preset="heading-6" className="text-[--ods-color-heading]">
          {region}
        </Text>
      ),
    };

    return [regionDetails];
  }, [region, t]);

  const cartItems: TCartItem[] = useMemo(
    () => [
      {
        id: '0',
        title: t('pci_instances_common_instance_title'),
        name,
        details: itemDetails,
        expanded: true,
      },
      {
        id: '1',
        title: t('pci_instances_common_instance_title'),
        name,
        details: itemDetails,
        expanded: false,
      },
      {
        id: '2',
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
