import { useMemo } from 'react';
import { Text } from '@ovhcloud/ods-react';

import {
  Cart as BaseCart,
  CartItem,
  CartItemHeader,
  CartItemDetails,
  CartTotalPrice,
  CartActions,
} from '@/components/cart/components';
import { CartContent } from './components/CartContent.component';
import {
  TCartItem,
  TCartItemDetail,
} from '@/pages/instances/create/hooks/useCartItems';

export type TCartProps = {
  items: TCartItem[];
  actionsButtons: JSX.Element;
};

const getTotalPrice = (items: TCartItemDetail[]) =>
  items.reduce((prev, curr) => (curr.price ? prev + curr.price : prev), 0);

export const Cart = ({ items, actionsButtons }: TCartProps) => {
  const details = useMemo(() => items.flatMap(({ details }) => details), [
    items,
  ]);

  return (
    <BaseCart className="sticky right-0 top-8 bg-white">
      <CartContent
        items={items}
        renderCartItem={({ item, isExpanded }) => (
          <CartItem key={item.title} value={item.id}>
            <CartItemHeader isExpanded={isExpanded(item.id)}>
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
      <CartTotalPrice
        price={getTotalPrice(details)}
        displayHourlyPrice
        displayMonthlyPrice
      />
      <CartActions className="flex-col gap-6">{actionsButtons}</CartActions>
    </BaseCart>
  );
};
