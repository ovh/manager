import { ReactNode, useMemo } from 'react';

import { Text } from '@ovhcloud/ods-react';

import { convertHourlyPriceToMonthly } from '@ovh-ux/muk';

import {
  CartActions,
  CartContainer,
  CartItem,
  CartItemDetails,
  CartItemHeader,
  CartTotalPrice,
} from '@/components/cart/components';
import { TBillingType } from '@/types';

import { TCartItem } from './Cart.model';
import { CartContent } from './components/CartContent.component';

export type TCartProps = {
  items: TCartItem[];
  actionsButtons: ReactNode;
  billingType: TBillingType;
};

type TCartTotals = {
  hourlyTotal: number | null;
  monthlyTotal: number | null;
};

const calculateTotals = (items: TCartItem[]): TCartTotals => {
  const hourlyTotal = items.reduce(
    (sum, item) => sum + item.details.reduce((sum, detail) => sum + (detail.price ?? 0), 0),
    0,
  );

  return {
    hourlyTotal,
    monthlyTotal: convertHourlyPriceToMonthly(hourlyTotal),
  };
};

export const Cart = ({ items, actionsButtons, billingType }: TCartProps) => {
  const { hourlyTotal, monthlyTotal } = useMemo(() => calculateTotals(items), [items]);

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
        hourlyTotal={hourlyTotal}
        monthlyTotal={monthlyTotal}
        billingType={billingType}
      />
      <CartActions className="flex-col gap-6">{actionsButtons}</CartActions>
    </CartContainer>
  );
};
