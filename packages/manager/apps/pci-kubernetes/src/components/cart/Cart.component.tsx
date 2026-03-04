import { JSX, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, Icon, Text } from '@ovhcloud/ods-react';

import {
  CartActions,
  CartContainer,
  CartContent,
  CartItem,
  CartItemDetails,
  CartItemHeader,
  CartTotalPrice,
} from './components';

export type TCartProps = {
  items: TCartItem[];
  isSubmitDisabled: boolean;
};

export type TCartItem = {
  id: string;
  title: string;
  name?: string;
  details: TCartItemDetail[];
  expanded: boolean;
};

export type TCartItemDetail = {
  name: string;
  description?: JSX.Element;
  price?: number;
};

const getTotalPrice = (items: TCartItemDetail[]) =>
  items.reduce((prev, curr) => (curr.price ? prev + curr.price : prev), 0);

export const Cart = ({ items, isSubmitDisabled }: TCartProps) => {
  const { t } = useTranslation('add');

  const details = useMemo(() => items.flatMap(({ details }) => details), [items]);

  return (
    <CartContainer className="sticky right-0 top-8 bg-white">
      <CartContent
        items={items}
        renderCartItem={({ item, isExpanded }) => (
          <CartItem key={item.title} value={item.id}>
            <CartItemHeader isExpanded={isExpanded(item.id)}>
              <Text preset="heading-6" className="text-[--ods-color-heading]">
                {item.title.toUpperCase()}
              </Text>
              {item.name && (
                <Text
                  preset="label"
                  className="break-all text-[--ods-color-heading]"
                  data-testid="cart-header-subtitle"
                >
                  {item.name}
                </Text>
              )}
            </CartItemHeader>
            <CartItemDetails details={item.details} />
          </CartItem>
        )}
      />
      <CartTotalPrice price={getTotalPrice(details)} displayHourlyPrice displayMonthlyPrice />
      <CartActions className="flex-col gap-6">
        <Button disabled={isSubmitDisabled}>
          {t('kubernetes_add_create_cluster')} <Icon name="arrow-right" />
        </Button>
      </CartActions>
    </CartContainer>
  );
};
