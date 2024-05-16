import React from 'react';
import {
  OsdsLink,
  OsdsTile,
  OsdsText,
  OsdsIcon,
} from '@ovhcloud/ods-components/react/';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import clsx from 'clsx';
import './ManagerTile.scss';

// TODO: add translations for manager tile type
// Is it possible with the super component library ?
// Or should we pass all labels ?
export enum ManagerTileType {
  tutorial,
  catalog,
}

export type ManagerTileProps = {
  className?: string;
  href?: string;
  onClick?: () => void;
  tileType: ManagerTileType;
  moreLabel: string;
  title: string;
  description?: string;
};

export const ManagerTile: React.FC<ManagerTileProps> = ({
  className,
  href,
  onClick,
  tileType,
  moreLabel,
  title,
  description,
}) => {
  return (
    <a
      className={clsx(className, 'manager-tile')}
      target="_blank"
      rel="noopener"
      href={href}
      onClick={onClick}
    >
      <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} rounded className="tile">
        <div>
          <OsdsText
            className="tile-type"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {tileType === ManagerTileType.tutorial ? 'Tutorial' : 'Catalog'}
          </OsdsText>

          <OsdsText
            className="tile-title"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="tile-description"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {description}
          </OsdsText>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {moreLabel}
            <OsdsIcon
              slot="end"
              className="link-icon"
              size={ODS_ICON_SIZE.xxs}
              name={ODS_ICON_NAME.EXTERNAL_LINK}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsLink>
        </div>
      </OsdsTile>
    </a>
  );
};
