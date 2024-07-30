import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TILE_VARIANT } from '@ovhcloud/ods-components';
import { OsdsTile } from '@ovhcloud/ods-components/react';
import React from 'react';

const SimpleTile: React.FC<React.PropsWithChildren<{
  onClick?: () => void;
  isActive?: boolean;
}>> = ({ children, onClick, isActive }) => (
  <OsdsTile
    rounded
    inline
    color={
      isActive ? ODS_THEME_COLOR_INTENT.primary : ODS_THEME_COLOR_INTENT.default
    }
    variant={ODS_TILE_VARIANT.stroked}
    className={`flex items-center justify-center w-1/4  mr-5 text-center ${
      onClick ? 'cursor-pointer' : 'cursor-default'
    } ${
      isActive ? ' bg-[--ods-color-blue-100] border-[--ods-color-blue-600]' : ''
    }`}
    onClick={onClick}
  >
    {children}
  </OsdsTile>
);

export default SimpleTile;
