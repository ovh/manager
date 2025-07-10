import React, { ReactNode } from 'react';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { Subtitle } from '../../typography';

export interface HeadersProps {
  title?: string;
  badge?: {
    color: ODS_BADGE_COLOR;
    size: ODS_BADGE_SIZE;
    label: string;
  };
  subtitle?: string;
  description?: string;
  headerButton?: React.ReactElement;
  changelogButton?: React.ReactElement;
}

export const Headers: React.FC<HeadersProps> = ({
  title,
  badge,
  subtitle,
  description,
  headerButton,
  changelogButton,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-4 mb-[24px]">
          {title && <OdsText preset="heading-1">{title}</OdsText>}
          {badge && (
            <OdsBadge
              label={badge.label}
              color={badge.color}
              size={badge.size}
            />
          )}
        </div>
        {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
        {description && (
          <OdsText className="mb-[16px]" preset="span">
            {description}
          </OdsText>
        )}
      </div>
      {(headerButton || changelogButton) && (
        <div className="flex flex-wrap justify-end items-center">
          {changelogButton}
          {headerButton}
        </div>
      )}
    </div>
  );
};

export default Headers;
