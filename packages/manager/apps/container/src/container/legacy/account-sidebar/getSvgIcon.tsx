import React from 'react';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';

export const getSvgIcon = (iconName: string): JSX.Element => {
  return (
    <SvgIconWrapper name={iconName} height={24} width={24} className="block" />
  );
};
