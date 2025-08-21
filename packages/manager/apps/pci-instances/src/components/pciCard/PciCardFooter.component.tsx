import { PropsWithChildren } from 'react';
import clsx from 'clsx';

type TPciCardFooterProps = PropsWithChildren<{
  className?: string;
}>;

export const PciCardFooter = ({ children, className }: TPciCardFooterProps) => (
  <div className={clsx('flex gap-4 justify-between', className)}>
    {children}
  </div>
);
