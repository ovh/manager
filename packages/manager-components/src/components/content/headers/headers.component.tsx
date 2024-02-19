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
    <div className="pl-5 flex items-center justify-between">
      <div>
        {title && <Title>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {description && <Description>{description}</Description>}
      </div>
      <div>{headerButton}</div>
    </div>
  );
};

export default Headers;
