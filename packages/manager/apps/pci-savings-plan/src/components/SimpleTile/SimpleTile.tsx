import { OdsCard } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import React from 'react';

export const Block: React.FC<React.PropsWithChildren<{
  className?: string;
}>> = ({ children, className }) => (
  <div className={clsx('my-8', className)}>{children}</div>
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
        'border-[--ods-color-primary-500] border-2 bg-[--ods-color-primary-050]': isActive,
        'hover:border-2 hover:border-[--ods-color-primary-500] hover:bg-[--ods-color-primary-050]': !isActive,
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
