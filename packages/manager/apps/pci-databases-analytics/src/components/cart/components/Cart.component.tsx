import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface CartProps {
  className?: string;
}

const Cart = ({ children, className }: PropsWithChildren<CartProps>) => (
  <div
    className={cn(
      'rounded-md border border-solid border-gray-400 shadow-lg p-4',
      className,
    )}
  >
    {children}
  </div>
);

export default Cart;
