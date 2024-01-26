import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
      rel={OdsHTMLAnchorElementRel.noopener}
      href={href}
    >
      <OsdsTile
        style={{ width: '100%', height: '100%' }}
        color={ODS_THEME_COLOR_INTENT.primary}
        rounded
        inline
        variant="stroked"
        dataTracking={trackingLabel}
        hoverable={hoverable}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {img?.src && (
            <img
              style={{ maxWidth: '100%', margin: 'var(--ods-size-03) auto' }}
              src={img.src}
              alt={img.alt}
            />
          )}
          <OsdsText
            style={{ display: 'block' }}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {category}
            <span
              style={{
                display: 'inline-flex',
                marginLeft: 'var(--ods-size-03)',
              }}
            >
              {badges?.map((b) => (
                <OsdsChip
                  key={b.text}
                  style={{ marginRight: 'var(--ods-size-01)' }}
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
            style={{ display: 'block', marginBottom: 'var(--ods-size-05)' }}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {title}
          </OsdsText>
          <OsdsText
            style={{ display: 'block', marginBottom: 'var(--ods-size-04)' }}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {description}
          </OsdsText>
          <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} href={href}>
            {t('see_more_label')}
            <OsdsIcon
              slot="end"
              style={{ marginLeft: 'var(--ods-size-04)' }}
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
