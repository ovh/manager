import { ButtonHTMLAttributes } from 'react'
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Locale, defaultLocale } from '@ovhcloud/msc-utils';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';

import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';

interface Badge {
  text: string,
  color: string,
}

export interface MscTileProps {
  href?: string;
  isExternalHref?: boolean;
  imgSrc?: string;
  imgAlt?: string;
  category: string;
  tileTitle: string;
  tileDescription: string;
  dataTracking?: string;
  locale?: Locale;
  badges?: Badge[]
}

export const MscTile = ({ href, isExternalHref, category, imgSrc, imgAlt, tileDescription, tileTitle, dataTracking, badges }: MscTileProps) => {
  const localeStrings = { see_more_label: 'tete' }
  const hasFooterContent = 0
  return (
    <div>
      <OsdsTile
        className="msc-ods-tile"
        color={ODS_THEME_COLOR_INTENT.primary}
        rounded
        inline
      >
        <div className="tile-content">
          {imgSrc && (
            <img className="tile-img" src={imgSrc} alt={imgAlt} />
          )}
          <OsdsText
            className="tile-type"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {category}
            <span className="tile-badge-list">
              {badges?.map(b => <OsdsChip>{b.text}</OsdsChip>)}
            </span>
          </OsdsText>

          <OsdsText
            className="tile-title"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tileTitle}
          </OsdsText>
          <OsdsText
            className="tile-description"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {tileDescription}
          </OsdsText>
          <OsdsLink
            tabIndex={hasFooterContent ? 0 : -1}
            data-tracking={dataTracking}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
          >
            {localeStrings?.see_more_label}
            <OsdsIcon
              slot="end"
              className="link-icon"
              aria-hidden="true"
              size={ODS_ICON_SIZE.xxs}
              name={
                isExternalHref
                  ? ODS_ICON_NAME.EXTERNAL_LINK
                  : ODS_ICON_NAME.ARROW_RIGHT
              }
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsLink>
          <slot name="footer" ></slot>
        </div>
        <div className="tile-container"><OsdsTile color="info" rounded="" size="md" variant="stroked" ><span>Oles ipsum dolor sit amet, commune proin cdn nonumes armor</span></OsdsTile></div>
      </OsdsTile>
    </div>
  )
}
