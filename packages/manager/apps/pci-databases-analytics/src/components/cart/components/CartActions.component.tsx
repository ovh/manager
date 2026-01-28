import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface CartActionsProps {
  className?: string;
}

const CartActions = ({
  children,
  className,
}: PropsWithChildren<CartActionsProps>) => (
  <div className={cn('flex p-4', className)}>{children}</div>
);

export default CartActions;
