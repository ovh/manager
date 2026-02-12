import { PropsWithChildren } from 'react';

import { clsx } from 'clsx';

type TCartActionsProps = PropsWithChildren<{
  className?: string;
}>;

export const CartActions = ({ className, children }: TCartActionsProps) => (
  <div data-testid="cart-actions" className={clsx('flex p-6 ', className)}>
    {children}
  </div>
);
