import { OdsCard } from '@ovhcloud/ods-components/react';
import React from 'react';

const SimpleTile: React.FC<React.PropsWithChildren<{
  onClick?: () => void;
  isActive?: boolean;
}>> = ({ children, onClick, isActive }) => (
  <OdsCard
    className={`flex items-center flex-col justify-center w-1/2 shrink-0 md:shrink md:w-1/4  mr-5 text-center p-3 ${
      onClick ? 'cursor-pointer' : 'cursor-default'
    } ${
      isActive ? ' bg-[--ods-color-blue-100] border-[--ods-color-blue-600]' : ''
    }`}
    onClick={onClick}
  >
    {children}
  </OdsCard>
);

export default SimpleTile;
