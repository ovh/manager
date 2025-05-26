import { OdsCard } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import React from 'react';

export const Block: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="my-8">{children}</div>
);

const SimpleTile: React.FC<React.PropsWithChildren<{
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}>> = ({ children, onClick, isActive, className }) => (
  <OdsCard
    className={clsx(
      'flex  items-center flex-col justify-center min-w-[50%] max-w-[50%]  md:min-w-[25%] md:max-w-[25%]  text-center p-6 border',
      {
        'cursor-pointer': onClick,
        'cursor-default': !onClick,
        'border-[--ods-color-primary-500] border-2': isActive,
        'hover:border-2': !isActive,
      },
      className,
    )}
    color="neutral"
    onClick={onClick}
  >
    {children}
  </OdsCard>
);

export default SimpleTile;
