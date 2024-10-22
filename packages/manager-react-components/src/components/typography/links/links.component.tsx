import React from 'react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}

export interface LinksProps {
  className?: string;
  download?: string;
  label?: React.ReactNode;
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
  <OsdsLink
    color={ODS_THEME_COLOR_INTENT.primary}
    onClick={onClickReturn}
    {...props}
  >
    <span slot="start">
      {type === LinkType.back && (
        <OsdsIcon
          className="mr-4"
          hoverable
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      )}
    </span>

    {label}
    {[LinkType.next, LinkType.external].includes(type) && (
      <span slot="end">
        <OsdsIcon
          aria-hidden="true"
          className="ml-4"
          name={
            type === LinkType.external
              ? ODS_ICON_NAME.EXTERNAL_LINK
              : ODS_ICON_NAME.ARROW_RIGHT
          }
          hoverable
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </span>
    )}
  </OsdsLink>
);

export default Links;
