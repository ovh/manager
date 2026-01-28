import { AccordionTrigger } from '@datatr-ux/uxlib';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

const CartItemHeader = ({ children }: PropsWithChildren) => (
  <AccordionTrigger
    className={cn(
      'border border-gray-200 p-4 hover:no-underline',
      'data-[state=open]:rounded-t-sm data-[state=closed]:rounded-sm',
    )}
  >
    {children}
  </AccordionTrigger>
);

export default CartItemHeader;
