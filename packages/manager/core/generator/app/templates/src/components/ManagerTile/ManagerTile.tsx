import React from 'react';
import {
  OsdsLink,
  OsdsTile,
  OsdsIcon,
} from '@ovhcloud/ods-stencil/components/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import {
  OdsIconName,
  OdsIconSize,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-core';
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
      <OsdsTile color={OdsThemeColorIntent.primary} rounded className="tile">
        <div>
          <OsdsText
            className="tile-type"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={OdsThemeColorIntent.primary}
          >
            {tileType === ManagerTileType.tutorial ? 'Tutorial' : 'Catalog'}
          </OsdsText>

          <OsdsText
            className="tile-title"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={OdsThemeColorIntent.text}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="tile-description"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={OdsThemeColorIntent.default}
          >
            {description}
          </OsdsText>
          <OsdsLink
            color={OdsThemeColorIntent.primary}
            href={href}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {moreLabel}
            <OsdsIcon
              slot="end"
              className="link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.EXTERNAL_LINK}
              color={OdsThemeColorIntent.primary}
            />
          </OsdsLink>
        </div>
      </OsdsTile>
    </a>
  );
};
