import React from 'react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { CommonTitle } from '@ovhcloud/manager-components';

type TileItemProps = {
  title: string;
};

export const TileItem: React.FC<React.PropsWithChildren & TileItemProps> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._200}>
        {title}
      </CommonTitle>
      {children}
    </div>
  );
};
