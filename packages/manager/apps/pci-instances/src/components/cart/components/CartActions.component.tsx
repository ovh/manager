import clsx from 'clsx';
import { ReactNode } from 'react';

type CartActionsProps = {
  children: ReactNode;
  className?: string;
};

export const CartActions = ({ className, children }: CartActionsProps) => (
  <div className={clsx('flex p-6 ', className)}>{children}</div>
);
