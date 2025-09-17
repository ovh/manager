import { AccordionItem } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';

type TCartItemProps = PropsWithChildren<{
  value: string;
}>;

export const CartItem = ({ value, children }: TCartItemProps) => (
  <AccordionItem value={value} data-testid={`cart-item-${value}`}>
    {children}
  </AccordionItem>
);
