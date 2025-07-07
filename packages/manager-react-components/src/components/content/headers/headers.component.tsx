import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { WrapPreset } from '../../wrap/Wrap.props';
import Wrap from '../../wrap/Wrap.component';

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
        {title && <Wrap preset={WrapPreset.title}>{title}</Wrap>}
        {subtitle && (
          <Wrap preset={WrapPreset.subtitle} className="block mb-6">
            {subtitle}
          </Wrap>
        )}
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
