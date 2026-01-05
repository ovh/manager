import { Cart } from '@/components/cart/Cart.component';
import { useCartItems } from '../hooks/useCartItems';

export const CreationCart = () => {
  const { cartItems, cartActions } = useCartItems();

  return <Cart items={cartItems} actionsButtons={cartActions} />;
};
