import { AccordionItem } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';

type TCartItemProps = PropsWithChildren<{
  value: string;
}>;

export const CartItem = ({ value, children }: TCartItemProps) => (
  <AccordionItem
    className="flex min-h-0 flex-1 flex-col border-none [&>button]:rounded-t-sm"
    value={value}
    data-testid={`cart-item-${value}`}
  >
    {children}
  </AccordionItem>
);
