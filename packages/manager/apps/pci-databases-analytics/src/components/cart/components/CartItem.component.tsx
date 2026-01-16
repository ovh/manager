import { AccordionItem } from '@datatr-ux/uxlib';
import { PropsWithChildren } from 'react';

interface CartItemProps {
  value: string;
}

const CartItem = ({ children, value }: PropsWithChildren<CartItemProps>) => (
  <AccordionItem className="border-none [&>button]:rounded-t-sm" value={value}>
    {children}
  </AccordionItem>
);

export default CartItem;
