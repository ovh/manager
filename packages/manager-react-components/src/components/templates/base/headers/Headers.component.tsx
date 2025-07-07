import React from 'react';
import { Wrap, WrapPreset } from '../../../wrap';
import { HeadersProps } from './Headers.props';

export const Headers: React.FC<HeadersProps> = ({
  title,
  guideButton,
  changelogButton,
}) => {
  return (
    <header className="flex items-start justify-between">
      {title && (
        <Wrap preset={WrapPreset.title} data-testid="title">
          {title}
        </Wrap>
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
