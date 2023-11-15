import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';

import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { useDynamicTranslation } from '../../translation/useDynamicTranslation';

export interface Badge {
  text: string;
  color: ODS_THEME_COLOR_INTENT;
}

export interface ImageDetails {
  src?: string;
  alt?: string;
}

export interface ScTileProps {
  href: string;
  isExternalHref?: boolean;
  img?: ImageDetails;
  texts: {
    title: string;
    description: string;
    category: string;
  };
  dataTracking?: string;
  badges?: Badge[];
}

export const ScTile = ({
  href,
  isExternalHref,
  img,
  dataTracking,
  badges,
  texts,
}: ScTileProps) => {
  const { title, description, category } = texts;
  const { t } = useDynamicTranslation('tile');

  return (
    <a
      className="msc-tile-wrapper"
      target={OdsHTMLAnchorElementTarget._blank}
      rel={OdsHTMLAnchorElementRel.noopener}
      href={href}
    >
      <OsdsTile
        className="msc-ods-tile"
        color={ODS_THEME_COLOR_INTENT.primary}
        rounded
        inline
        variant="stroked"
      >
        <div className="flex flex-col">
          {img?.src && (
            <img
              className="max-w-full my-3 mx-auto"
              src={img.src}
              alt={img.alt}
            />
          )}
          <OsdsText
            className="block"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {category}
            <span className="inline-flex ml-3">
              {badges?.map((b) => (
                <OsdsChip
                  className="mr-1"
                  key={b.text}
                  color={b.color}
                  size={ODS_ICON_SIZE.sm}
                >
                  {b.text}
                </OsdsChip>
              ))}
            </span>
          </OsdsText>

          <OsdsText
            className="block mb-5"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {description}
          </OsdsText>
          <OsdsLink
            data-tracking={dataTracking}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
          >
            {t('see_more_label')}
            <OsdsIcon
              slot="end"
              className="ml-4"
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
        </div>
      </OsdsTile>
    </a>
  );
};
