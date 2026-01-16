import { AccordionTrigger } from '@datatr-ux/uxlib';
import { cn } from '@/lib/utils';

interface CartItemHeaderProps {
  children: React.ReactNode | React.ReactNode[];
}

const CartItemHeader = ({ children }: CartItemHeaderProps) => (
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
