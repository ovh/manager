import { PropsWithChildren } from 'react';

import clsx from 'clsx';

type TPciCardContentProps = PropsWithChildren<{
  className?: string;
}>;

export const PciCardContent = ({ children, className }: TPciCardContentProps) => (
  <div className={clsx('flex grow flex-col', className)}>{children}</div>
);
