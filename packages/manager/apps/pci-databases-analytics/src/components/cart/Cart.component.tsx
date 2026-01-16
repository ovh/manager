import { useMemo } from 'react';
import { CartItem as CartItemType } from './cart.types';
import {
  Cart as BaseCart,
  CartActions,
  CartContent,
  CartItem,
  CartItemDetails,
  CartItemHeader,
  CartTotalPrice,
} from './components';
import { order } from '@/types/catalog';

interface CartProps {
  items: CartItemType[];
  actionButtons: React.ReactNode | React.ReactNode[];
  currency: order.CurrencyCodeEnum;
}

const Cart = ({ items, actionButtons, currency }: CartProps) => {
  const totalPrice = useMemo(
    () =>
      items
        .flatMap(({ details }) => details.map(({ price }) => price))
        .reduce((acc, price) => acc + (price ?? 0), 0),

    [items],
  );
  const totalPriceWithTax = useMemo(
    () =>
      items
        .flatMap(({ details }) =>
          details.map(({ priceWithTax }) => priceWithTax),
        )
        .reduce((acc, priceWithTax) => acc + (priceWithTax ?? 0), 0),
    [items],
  );
  return (
    <BaseCart className="sticky top-4 h-fit">
      <CartContent
        items={items}
        renderCartItem={(item) => (
          <CartItem key={item.title} value={item.id}>
            <CartItemHeader>
              <div className="flex flex-col items-start">
                <h6 className="text-sm font-semibold">
                  {item.title.toUpperCase()}
                </h6>
                {item.name && (
                  <label className="text-lg font-bold">{item.name}</label>
                )}
              </div>
            </CartItemHeader>
            <CartItemDetails details={item.details} currency={currency} />
          </CartItem>
        )}
      />
      <CartTotalPrice
        price={totalPrice}
        priceWithTax={totalPriceWithTax}
        currency={currency}
      />
      <CartActions className="flex-col gap-4">{actionButtons}</CartActions>
    </BaseCart>
  );
};

export default Cart;
