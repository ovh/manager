import { Accordion } from '@datatr-ux/uxlib';
import { CartItem } from '../cart.types';

interface CartContentProps {
  items: CartItem[];
  renderCartItem: (item: CartItem) => React.ReactNode;
}

const CartContent = ({ items, renderCartItem }: CartContentProps) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={items
        .filter((item) => item.expanded)
        .map((item) => item.id)}
    >
      {items.map((item) => renderCartItem(item))}
    </Accordion>
  );
};

export default CartContent;
