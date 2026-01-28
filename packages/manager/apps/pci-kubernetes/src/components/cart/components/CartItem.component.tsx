import { PropsWithChildren } from 'react';

import { AccordionItem } from '@ovhcloud/ods-react';

type TCartItemProps = PropsWithChildren<{
  value: string;
}>;

export const CartItem = ({ value, children }: TCartItemProps) => (
  <AccordionItem
    className="border-none [&>button]:rounded-t-sm"
    value={value}
    data-testid={`cart-item-${value}`}
  >
    {children}
  </AccordionItem>
);
