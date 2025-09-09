import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type CartActionsProps = PropsWithChildren<{
  className?: string;
}>;

export const CartActions = ({ className, children }: CartActionsProps) => (
  <div data-testid="cart-actions" className={clsx('flex p-6 ', className)}>
    {children}
  </div>
);
