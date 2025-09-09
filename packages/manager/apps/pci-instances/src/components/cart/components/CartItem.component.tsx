import { AccordionItem } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';

type TCartItem = PropsWithChildren<{
  value: string;
}>;

export const CartItem = ({ value, children }: TCartItem) => (
  <AccordionItem value={value} data-testid={`cart-item-${value}`}>
    {children}
  </AccordionItem>
);
