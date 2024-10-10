import React from 'react';
import { useTranslation } from 'react-i18next';

import { OdsBadge, OdsCard } from '@ovhcloud/ods-components/react';
import { LinkType, Links } from '../../typography';
import './translations/translations';

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
      target="_blank"
      href={href}
      className="no-underline"
      onClick={onClick}
      {...props}
    >
      <OdsCard
        className="w-full h-full p-[1rem]"
        color="neutral"
        data-tracking={trackingLabel}
      >
        <div className="flex flex-col">
          {img?.src && (
            <img
              className="max-w-full my-3 mx-auto"
              src={img.src}
              alt={img.alt}
            />
          )}
          <div>
            <span className="card-category text-[--ods-color-primary-500] text-[20px] leading-[28px] font-bold">
              {category}
            </span>
            <span className="ml-[10px] card-badges-section">
              {badges?.map((b) => (
                <OdsBadge className="mr-1" key={b.text} label={b.text} />
              ))}
            </span>
          </div>

          <span className="card-title text-[--ods-color-heading] text-[24px] leading-[32px] font-bold mb-[8px]">
            {title}
          </span>
          {description && (
            <p className="block m-0 p-0 text-[--ods-color-text] mb-4">
              {description}
            </p>
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
