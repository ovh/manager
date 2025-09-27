import { PropsWithChildren } from 'react';
import clsx from 'clsx';

type TPciCardContentProps = PropsWithChildren<{
  className?: string;
}>;

export const PciCardContent = ({
  children,
  className,
}: TPciCardContentProps) => (
  <div className={clsx('flex flex-col grow', className)}>{children}</div>
);
