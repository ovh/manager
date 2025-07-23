import React from 'react';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { HeadersProps } from './Headers.props';

export const Headers: React.FC<HeadersProps> = ({
  title,
  guideButton,
  changelogButton,
}) => {
  return (
    <header className="flex items-start justify-between">
      {title && (
        <Text preset={TEXT_PRESET.heading1} data-testid="title">
          {title}
        </Text>
      )}
      {(guideButton || changelogButton) && (
        <div className="flex flex-wrap justify-end items-center">
          {changelogButton}
          {guideButton}
        </div>
      )}
    </header>
  );
};

export default Headers;
