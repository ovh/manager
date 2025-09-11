import { useTranslation } from 'react-i18next';
import { PropsWithChildren } from 'react';
import { Button, Icon, Text } from '@ovhcloud/ods-react';

import {
  Cart as BaseCart,
  CartItem,
  CartItemHeader,
  CartItemDetails,
  CartTotalPrice,
  CartActions,
} from '@/components/cart/components';
import { CartContent } from './components/CartContent.component';

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

export const Cart = ({ items }: TCartProps) => {
  const { t } = useTranslation('creation');

  return (
    <BaseCart>
      <CartContent
        items={items}
        renderCartItem={({ item, isExpanded }) => (
          <CartItem key={item.title} value={item.title}>
            <CartItemHeader isExpanded={isExpanded(item.title)}>
              <Text preset="heading-6" className="text-[--ods-color-heading]">
                {item.title.toUpperCase()}
              </Text>
              {item.name && (
                <Text preset="label" className="text-[--ods-color-heading]">
                  {item.name}
                </Text>
              )}
            </CartItemHeader>
            <CartItemDetails details={item.details} />
          </CartItem>
        )}
      />
      <CartTotalPrice price={0} displayHourlyPrice displayMonthlyPrice />
      <CartActions className="flex-col gap-6">
        <Button>
          {t('pci_instance_creation_continue_order')} <Icon name="home" />
        </Button>
        <Button variant="outline">
          {t('pci_instance_creation_configuration_code')}
        </Button>
      </CartActions>
    </BaseCart>
  );
};
