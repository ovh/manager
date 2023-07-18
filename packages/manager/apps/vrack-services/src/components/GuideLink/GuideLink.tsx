import React from 'react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { useGuideUtils } from './guide-utils';

export type GuideLinkProps = React.PropsWithChildren<{
  name: string;
}>;

export const GuideLink: React.FC<GuideLinkProps> = ({ name, children }) => {
  const link = useGuideUtils();

  return (
    <OsdsLink
      href={link?.[name]}
      color={ODS_THEME_COLOR_INTENT.primary}
      target={OdsHTMLAnchorElementTarget._blank}
    >
      {children}
      <span slot="end">
        <OsdsIcon
          name={ODS_ICON_NAME.EXTERNAL_LINK}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </span>
    </OsdsLink>
  );
};
