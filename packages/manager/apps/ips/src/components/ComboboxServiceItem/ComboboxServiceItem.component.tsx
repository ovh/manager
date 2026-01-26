import React from 'react';

import { Text, ComboboxOptionItem, TEXT_PRESET } from '@ovhcloud/ods-react';

export type ServiceData = {
  name: string;
  displayName?: string;
};

export const ComboboxServiceItem = ({
  label,
  customRendererData,
  disabled,
}: ComboboxOptionItem<ServiceData>): React.ReactElement => (
  <span
    className={
      disabled ? 'pointer-events-none cursor-not-allowed bg-gray-100' : ''
    }
    aria-disabled={disabled}
  >
    {!customRendererData?.displayName ||
    customRendererData?.displayName === customRendererData?.name ? (
      <Text className="px-3 py-1">{customRendererData?.name || label}</Text>
    ) : (
      <div className="flex flex-col px-3 py-1">
        <Text preset={TEXT_PRESET.paragraph}>
          {customRendererData?.displayName}
        </Text>
        <Text preset={TEXT_PRESET.caption}>{customRendererData?.name}</Text>
      </div>
    )}
  </span>
);
