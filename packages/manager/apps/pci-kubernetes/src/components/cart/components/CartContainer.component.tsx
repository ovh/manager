import { PropsWithChildren } from 'react';

import { clsx } from 'clsx';

type TCartContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const CartContainer = ({ children, className }: TCartContainerProps) => (
  <div
    className={clsx('rounded-md border border-solid border-gray-400 p-6 shadow-lg', className)}
    data-testid="cart"
  >
    {children}
  </div>
);
