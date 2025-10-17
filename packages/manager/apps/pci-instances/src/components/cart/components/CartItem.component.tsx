import { AccordionItem } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';

type TCartItemProps = PropsWithChildren<{
  value: string;
}>;

export const CartItem = ({ value, children }: TCartItemProps) => (
  <AccordionItem
    className="border-none [&>button]:rounded-tl-[10px] [&>button]:rounded-tr-[10px]"
    value={value}
    data-testid={`cart-item-${value}`}
  >
    {children}
  </AccordionItem>
);
