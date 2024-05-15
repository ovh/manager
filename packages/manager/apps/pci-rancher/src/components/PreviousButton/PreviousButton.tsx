import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import React from 'react';

interface PreviousButtonProps {
  href: string;
  text: string;
}

const PreviousButton = ({ href, text }: PreviousButtonProps) => {
  return (
    <OsdsLink
      href={href}
      color={ODS_THEME_COLOR_INTENT.primary}
      className="flex items-center my-6"
    >
      <OsdsIcon
        className="mr-4"
        name={ODS_ICON_NAME.ARROW_LEFT}
        size={ODS_ICON_SIZE.xxs}
        color={ODS_THEME_COLOR_INTENT.primary}
      />
      <span>{text}</span>
    </OsdsLink>
  );
};

export default PreviousButton;
