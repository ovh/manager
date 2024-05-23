import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-components';
import { OsdsText, OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import React, { FC } from 'react';

type LinkIconProps = {
  text: string;
  href: string;
  iconName: ODS_ICON_NAME;
  target?: OdsHTMLAnchorElementTarget;
  slot?: 'start' | 'end';
};
const LinkIcon: FC<LinkIconProps> = ({
  text,
  href,
  iconName,
  target,
  slot = 'end',
}) => {
  return (
    <OsdsLink
      className="flex flex-row mt-2"
      href={href}
      aria-label="edit-link"
      target={target}
    >
      <OsdsText
        className="overflow-hidden text-ellipsis max-w-[300px]"
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_TEXT_SIZE._200}
      >
        {text}
      </OsdsText>
      <span slot={slot}>
        <OsdsIcon
          aria-hidden="true"
          className="mx-4 cursor-pointer"
          name={iconName}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </span>
    </OsdsLink>
  );
};

export default LinkIcon;
