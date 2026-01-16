import { AccordionItem } from '@datatr-ux/uxlib';

interface CartItemProps {
  value: string;
  children: React.ReactNode | React.ReactNode[];
}

const CartItem = ({ children, value }: CartItemProps) => (
  <AccordionItem className="border-none [&>button]:rounded-t-sm" value={value}>
    {children}
  </AccordionItem>
);

export default CartItem;
