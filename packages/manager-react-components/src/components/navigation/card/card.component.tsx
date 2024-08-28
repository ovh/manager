import React from 'react';
import { useTranslation } from 'react-i18next';

import { OdsText, OdsBadge, OdsCard } from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { LinkType, Links } from '../../typography';
import './translations/translations';
import './card.scss';

export interface Badge {
  text: string;
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
      <OdsCard className="w-full h-full p-[1rem]" data-tracking={trackingLabel}>
        <div className="flex flex-col ">
          {img?.src && (
            <img
              className="max-w-full my-3 mx-auto"
              src={img.src}
              alt={img.alt}
            />
          )}
          <div>
            <span>
              <OdsText
                className="card-category"
                preset={ODS_TEXT_PRESET.heading5}
              >
                <b>{category}</b>
              </OdsText>
            </span>
            <span className="ml-[10px] card-badges-section">
              {badges?.map((b) => (
                <OdsBadge className="mr-1" key={b.text} label={b.text} />
              ))}
            </span>
          </div>

          <OdsText className="card-title" preset={ODS_TEXT_PRESET.heading6}>
            {title}
          </OdsText>
          {description && (
            <OdsText className="block mb-4">{description}</OdsText>
          )}
          <div className="section-see-more-label">
            <Links
              tab-index="-1"
              label={hrefLabel ?? t('see_more_label')}
              type={isExternalHref ? LinkType.external : LinkType.next}
            />
          </div>
        </div>
      </OdsCard>
    </a>
  );
};
