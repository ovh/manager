import React from 'react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsLink, OdsIcon } from '@ovhcloud/ods-components/react';
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
  className?: string;
  download?: string;
  label?: string;
  href?: string;
  rel?: OdsHTMLAnchorElementRel;
  target?: OdsHTMLAnchorElementTarget;
  type?: LinkType;
  onClickReturn?: () => void;
}

export const Links: React.FC<LinksProps> = ({
  label,
  onClickReturn,
  type,
  ...props
}: LinksProps) => (
  <OdsLink
    href="#"
    onClick={onClickReturn}
    {...props}
    {...(type === LinkType.next && { icon: ODS_ICON_NAME.arrowRight })}
    {...(type === LinkType.external && { icon: ODS_ICON_NAME.externalLink })}
    label={label}
  ></OdsLink>
);

export default Links;
