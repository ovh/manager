import { Cart } from '@/components/cart/Cart.component';
import { useCartItems } from '../hooks/useCartItems';
import { useCartActions } from '../hooks/useCartActions';

export const CreationCart = () => {
  const { cartItems } = useCartItems();
  const { cartActions } = useCartActions();

  return <Cart items={cartItems} actionsButtons={cartActions} />;
};
