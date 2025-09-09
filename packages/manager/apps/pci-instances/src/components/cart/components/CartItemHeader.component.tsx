import { AccordionTrigger } from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type TCartHeader = PropsWithChildren<{
  isExpanded?: boolean;
}>;

export const CartItemHeader = ({
  isExpanded = true,
  children,
}: TCartHeader) => (
  <AccordionTrigger
    className={clsx(
      'border border-gray-200',
      isExpanded ? 'rounded-t-lg' : 'rounded-sm',
    )}
    data-testid="cart-item-header"
  >
    {children}
  </AccordionTrigger>
);
