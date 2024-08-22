import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';

import { OsdsText, OsdsChip, OsdsTile } from '@ovhcloud/ods-components/react';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import { LinkType, Links } from '../../typography';
import './translations/translations';

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
  hrefLabel?: string;
  img?: ImageDetails;
  texts: {
    title: string;
    description?: string;
    category: string;
  };
  badges?: Badge[];
  hoverable?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  trackingLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  href,
  isExternalHref,
  hrefLabel,
  img,
  badges,
  texts,
  hoverable,
  onClick,
  trackingLabel,
  ...props
}) => {
  const { title, description, category } = texts;
  const { t } = useTranslation('card');

  return (
    <a
      target={OdsHTMLAnchorElementTarget._blank}
      href={href}
      className="no-underline"
      onClick={onClick}
      {...props}
    >
      <OsdsTile
        className="w-full h-full"
        color={ODS_THEME_COLOR_INTENT.primary}
        rounded
        inline
        variant={ODS_TILE_VARIANT.stroked}
        hoverable={hoverable}
        data-tracking={trackingLabel}
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
            <span style={{ marginLeft: 'var(--ods-size-03)' }}>
              {badges?.map((b) => (
                <OsdsChip
                  className="mr-1"
                  key={b.text}
                  color={b.color}
                  size={ODS_CHIP_SIZE.sm}
                  inline
                >
                  {b.text}
                </OsdsChip>
              ))}
            </span>
          </OsdsText>

          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.primary}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {title}
          </OsdsText>
          {description && (
            <OsdsText
              className="block mb-4"
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              {description}
            </OsdsText>
          )}

          <Links
            tab-index="-1"
            label={hrefLabel ?? t('see_more_label')}
            type={isExternalHref ? LinkType.external : LinkType.next}
          />
        </div>
      </OsdsTile>
    </a>
  );
};
