import { PropsWithChildren } from 'react';

import clsx from 'clsx';

type TPciCardFooterProps = PropsWithChildren<{
  className?: string;
}>;

export const PciCardFooter = ({ children, className }: TPciCardFooterProps) => (
  <div className={clsx('flex justify-between gap-4', className)}>{children}</div>
);
