import React from 'react';

import { SPINNER_SIZE, Spinner, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

export type LoadingTextProps = {
  title?: string;
  description?: string;
};

export const LoadingText: React.FC<LoadingTextProps> = ({ title, description }) => (
  <div className="flex items-center">
    <Spinner size={SPINNER_SIZE.md} />
    <div className="mb-3 ml-5 flex flex-col">
      <Text preset={TEXT_PRESET.paragraph}>{title}</Text>
      {description && (
        <Text className="block" preset={TEXT_PRESET.paragraph}>
          {description}
        </Text>
      )}
    </div>
  </div>
);
