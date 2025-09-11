import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PropsWithChildren, useMemo } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { TInstanceCreationForm } from '@/pages/instances/create/CreateInstance.page';
import { Cart } from '@/components/cart/Cart.component';

export type TProductDetail = PropsWithChildren<{
  name: string;
}>;

export type TCartProps = {
  items: TCartItem[];
};

export type TCartItem = {
  title: string;
  name?: string;
  details: TCartItemDetail[];
  expanded: boolean;
};

export type TCartItemDetail = {
  name: string;
  description?: JSX.Element;
  price?: string;
};

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
