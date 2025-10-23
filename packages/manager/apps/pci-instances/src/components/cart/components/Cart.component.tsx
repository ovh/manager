import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

type TCartProps = PropsWithChildren<{
  className?: string;
}>;

export const Cart = ({ children, className }: TCartProps) => (
  <div
    className={clsx(
      'rounded-md border border-solid border-gray-400 shadow-lg p-6',
      className,
    )}
    data-testid="cart"
  >
    {children}
  </div>
);
