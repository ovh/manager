import React from 'react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { CommonTitle } from '@ovh-ux/manager-react-components';

type TileItemProps = {
  title: string;
  titleStatus?: React.ReactNode;
};

export const TileItem: React.FC<React.PropsWithChildren & TileItemProps> = ({
  title,
  titleStatus,
  children,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between ">
        <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._200}>
          {title}
        </CommonTitle>
        {titleStatus}
      </div>
      {children}
    </div>
  );
};
