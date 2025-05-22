import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Title, Subtitle } from '../../typography';

export interface HeadersProps {
  title?: string;
  subtitle?: string;
  description?: string;
  headerButton?: React.ReactElement;
  changelogButton?: React.ReactElement;
}

export const Headers: React.FC<HeadersProps> = ({
  title,
  subtitle,
  description,
  headerButton,
  changelogButton,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        {title && <Title>{title}</Title>}
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
