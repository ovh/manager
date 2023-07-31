import React from 'react';
import {
  OsdsLink,
  OsdsTile,
  OsdsText,
  OsdsIcon,
} from '@ovhcloud/ods-stencil/components/react';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
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
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.primary}
          >
            {tileType === ManagerTileType.tutorial ? 'Tutorial' : 'Catalog'}
          </OsdsText>

          <OsdsText
            className="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._400}
            color={OdsThemeColorIntent.text}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._400}
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
