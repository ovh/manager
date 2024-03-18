import React from 'react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { ReactI18NextChild } from 'react-i18next';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}

export interface LinksProps {
  download?: string;
  label?: ReactI18NextChild | Iterable<ReactI18NextChild>;
  href?: string;
  rel?: OdsHTMLAnchorElementRel;
  target?: OdsHTMLAnchorElementTarget;
  type?: LinkType;
  [key: string]: any;
}

export const Links: React.FC<LinksProps> = ({
  download,
  label,
  href,
  target,
  type,
  rel,
  ...props
}: LinksProps) => {
  let arrowIcon;
  let arrowClass = '';

  if (type === LinkType.back) {
    arrowIcon = ODS_ICON_NAME.ARROW_LEFT;
    arrowClass = 'mr-4';
  } else if (type === LinkType.external) {
    arrowIcon = ODS_ICON_NAME.EXTERNAL_LINK;
    arrowClass = 'ml-4';
  } else if (type === LinkType.next) {
    arrowIcon = ODS_ICON_NAME.ARROW_RIGHT;
    arrowClass = 'ml-4';
  }

  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      download={download}
      href={href}
      target={target}
      rel={rel}
      {...props}
    >
      <span slot="start">
        {type === LinkType.back && (
          <OsdsIcon
            className={`${arrowClass}`}
            hoverable
            name={arrowIcon}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        )}
      </span>

      {label}
      {(type === LinkType.next || type === LinkType.external) && (
        <span slot="end">
          <OsdsIcon
            aria-hidden="true"
            className={`${arrowClass}`}
            name={arrowIcon}
            hoverable
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
      )}
    </OsdsLink>
  );
};

export default Links;
