import React from 'react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
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
  hoverable?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  [attribute: string]: any;
}

export const Card: React.FC<CardProps> = ({
  href,
  isExternalHref,
  img,
  badges,
  texts,
  hoverable,
  onClick,
  ...props
}) => {
  const { title, description, category } = texts;
  const { t } = useDynamicTranslation('card');

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
        variant="stroked"
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
            <span style={{ marginLeft: 'var(--ods-size-03)' }}>
              {badges?.map((b) => (
                <OsdsChip
                  className="mr-1"
                  key={b.text}
                  color={b.color}
                  size={ODS_ICON_SIZE.sm}
                  inline
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
            tabindex="-1"
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
