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
import { BILLING_TYPE } from '@/types/instance/common.type';
import { convertHourlyPriceToMonthly } from '@/utils';

export type TCartProps = {
  items: TCartItem[];
  actionsButtons: JSX.Element;
  billingType: BILLING_TYPE;
};

type TCartTotals = {
  hourlyTotal: number | null;
  monthlyTotal: number | null;
};

export const STRICTLY_HOURLY_ITEMS = ['volume', 'gateway', 'network'];

export const getItemDetailsTotalPrice = (
  detailsWithoutBackups: TCartItemDetail[],
  billingType: BILLING_TYPE,
) =>
  detailsWithoutBackups
    .filter((detail) =>
      billingType === BILLING_TYPE.Hourly
        ? STRICTLY_HOURLY_ITEMS.includes(detail.id)
        : !STRICTLY_HOURLY_ITEMS.includes(detail.id),
    )
    .reduce((sum, detail) => sum + (detail.price ?? 0), 0);

/**
 * Rules:
 * - Backups are always excluded from totals.
 * - Volume, gateway, and network are always hourly.
 * - Flavor and image follow the billing type.
 */

const calculateTotals = (
  items: TCartItem[],
  billingType: BILLING_TYPE,
): TCartTotals => {
  const detailsWithoutBackups = items.flatMap((item) =>
    item.details.filter((detail) => detail.id !== 'backup'),
  );

  switch (billingType) {
    case BILLING_TYPE.Hourly: {
      const hourlyTotal = detailsWithoutBackups.reduce(
        (sum, detail) => sum + (detail.price ?? 0),
        0,
      );

      return {
        hourlyTotal,
        monthlyTotal: convertHourlyPriceToMonthly(hourlyTotal),
      };
    }

    case BILLING_TYPE.Monthly: {
      const hourlyItemsTotal = getItemDetailsTotalPrice(
        detailsWithoutBackups,
        BILLING_TYPE.Hourly,
      );
      const monthlyItemsTotal = getItemDetailsTotalPrice(
        detailsWithoutBackups,
        BILLING_TYPE.Monthly,
      );

      const monthlyTotal =
        monthlyItemsTotal + convertHourlyPriceToMonthly(hourlyItemsTotal);

      return { hourlyTotal: null, monthlyTotal };
    }

    default:
      return { hourlyTotal: null, monthlyTotal: null };
  }
};

export const Cart = ({ items, actionsButtons, billingType }: TCartProps) => {
  const { hourlyTotal, monthlyTotal } = useMemo(
    () => calculateTotals(items, billingType),
    [items, billingType],
  );

  return (
    <BaseCart className="sticky right-0 top-8 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
            <CartItemDetails
              details={item.details}
              quantityHintParams={item.quantityHintParams}
            />
          </CartItem>
        )}
      />
      </div>
      <div className="shrink-0">
        <CartTotalPrice
          hourlyTotal={hourlyTotal}
          monthlyTotal={monthlyTotal}
          billingType={billingType}
        />
        <CartActions className="flex-col gap-6">{actionsButtons}</CartActions>
      </div>
    </BaseCart>
  );
};
