import { PropsWithChildren } from 'react';

import clsx from 'clsx';

type TPciCardHeaderProps = PropsWithChildren<{
  compact?: boolean;
  className?: string;
}>;

export const PciCardHeader = ({ children, compact, className }: TPciCardHeaderProps) => (
  <div className={clsx('flex flex-col items-start', compact ? 'gap-2' : 'gap-3', className)}>
    {children}
  </div>
);
