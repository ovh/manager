import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';

type UpdateIconProps = {
  onClick: React.MouseEventHandler<HTMLOsdsIconElement>;
};

export default function UpdateIcon({ onClick }: UpdateIconProps) {
  return (
    <OsdsIcon
      aria-label="edit"
      className="mx-6 cursor-pointer"
      name={ODS_ICON_NAME.PEN}
      size={ODS_ICON_SIZE.xxs}
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={onClick}
    />
  );
}
