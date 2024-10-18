import { CommonTitle } from '@ovh-ux/manager-react-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import React from 'react';

export type TChildrenProps = {
  children: string;
};

const TileSubtitle = ({ children }: TChildrenProps) => {
  return (
    <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._200}>
      {children}
    </CommonTitle>
  );
};

export default TileSubtitle;
