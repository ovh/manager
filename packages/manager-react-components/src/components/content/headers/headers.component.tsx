import React from 'react';
import { Description, Title, Subtitle } from '../../typography';

export interface HeadersProps {
  title?: string;
  subtitle?: string;
  description?: string;
  headerButton?: React.ReactElement;
}

export const Headers: React.FC<HeadersProps> = ({
  title,
  subtitle,
  description,
  headerButton,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        {title && <Title className="block mb-8">{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {description && (
          <Description className="mb-6">{description}</Description>
        )}
      </div>
      {headerButton && <div>{headerButton}</div>}
    </div>
  );
};

export default Headers;
