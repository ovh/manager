import React from 'react';
import { SPINNER_SIZE, TEXT_PRESET, Spinner, Text } from '@ovhcloud/ods-react';

export type LoadingTextProps = {
  title?: string;
  description?: string;
};

export const LoadingText: React.FC<LoadingTextProps> = ({
  title,
  description,
}) => (
  <div className="flex items-center">
    <Spinner size={SPINNER_SIZE.md} />
    <div className="ml-5 mb-3 flex flex-col">
      <Text preset={TEXT_PRESET.paragraph}>{title}</Text>
      {description && (
        <Text className="block" preset={TEXT_PRESET.paragraph}>
          {description}
        </Text>
      )}
    </div>
  </div>
);
