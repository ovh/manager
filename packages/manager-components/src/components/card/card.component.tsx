import React from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import {
  OsdsText,
  OsdsChip,
  OsdsTile,
  OsdsLink,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';

import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import useDynamicTranslation from '../../translation/useDynamicTranslation';

export interface Badge {
  text: string;
  color: ODS_THEME_COLOR_INTENT;
}

export interface ImageDetails {
  src?: string;
  alt?: string;
}

export interface CardProps {
  href: string;
  isExternalHref?: boolean;
  img?: ImageDetails;
  texts: {
    title: string;
    description: string;
    category: string;
  };
  badges?: Badge[];
  trackingLabel?: string;
  hoverable?: boolean;
}

export const Card = ({
  href,
  isExternalHref,
  img,
  badges,
  texts,
  trackingLabel,
  hoverable,
}: CardProps) => {
  const { title, description, category } = texts;
  const { t } = useDynamicTranslation('card');

  return (
    <a
      target={OdsHTMLAnchorElementTarget._blank}
      href={href}
      className="no-underline"
    >
      <OsdsTile
        className="w-full h-full"
        color={ODS_THEME_COLOR_INTENT.primary}
        rounded
        inline
        variant={ODS_TILE_VARIANT.stroked}
        data-tracking={trackingLabel}
        hoverable={hoverable}
      >
        <div className="flex flex-col ">
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
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.primary}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {category}
            <span className="inline-flex ml-3">
              {badges?.map((b) => (
                <OsdsChip
                  className="mr-1"
                  key={b.text}
                  color={b.color}
                  size={ODS_CHIP_SIZE.sm}
                >
                  {b.text}
                </OsdsChip>
              ))}
            </span>
          </OsdsText>

          <OsdsText
            className="block mb-5"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.primary}
            hue={ODS_THEME_COLOR_HUE._900}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {description}
          </OsdsText>
          <OsdsLink
            tab-index="-1"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
            target={OdsHTMLAnchorElementTarget._blank}
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
