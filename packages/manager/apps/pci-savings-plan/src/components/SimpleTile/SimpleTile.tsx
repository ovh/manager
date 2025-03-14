import { OdsCard } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import React from 'react';

const SimpleTile: React.FC<React.PropsWithChildren<{
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}>> = ({ children, onClick, isActive, className }) => (
  <OdsCard
    className={clsx(
      'flex items-center flex-col justify-center w-1/2 shrink-0 md:shrink md:w-1/4 mr-5 text-center',
      {
        'cursor-pointer': onClick,
        'cursor-default': !onClick,
        'border-[--ods-color-primary-500] border-2': isActive,
        'border border-[--ods-color-neutral-200]': !isActive,
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
