import { OdsCard } from '@ovhcloud/ods-components/react';
import React from 'react';

const SimpleTile: React.FC<React.PropsWithChildren<{
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}>> = ({ children, onClick, isActive, className }) => (
  <OdsCard
    className={`flex items-center flex-col justify-center w-1/2 shrink-0 md:shrink md:w-1/4  mr-5 text-center p-3 ${
      onClick ? 'cursor-pointer' : 'cursor-default'
    } ${
      isActive
        ? ' bg-[--ods-color-primary-050] border-[--ods-color-primary-500] border-2'
        : ''
    } ${className}`}
    color={'neutral'}
    onClick={onClick}
  >
    {children}
  </OdsCard>
);

export default SimpleTile;
