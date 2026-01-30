import { Cart } from '@/components/cart/Cart.component';
import { useCartItems } from '../hooks/useCartItems';
import { useCartActions } from '../hooks/useCartActions';
import { useInstanceCreation } from '../hooks/useInstanceCreation';

export const CreationCart = () => {
  const { cartItems } = useCartItems();
  const { cartActions } = useCartActions();
  const { instanceData } = useInstanceCreation();

  return (
    <Cart
      items={cartItems}
      actionsButtons={cartActions}
      billingType={instanceData.billingType}
    />
  );
};
