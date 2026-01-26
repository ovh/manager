import React from 'react';
import { Text, TEXT_PRESET, ComboboxOptionItem } from '@ovhcloud/ods-react';
import { ipParkingOptionValue } from '@/types';

export const ComboboxServiceItem = ({
  label,
  value,
  disabled,
}: ComboboxOptionItem): React.ReactElement => (
  <div
    className={
      disabled ? 'pointer-events-none cursor-not-allowed bg-gray-100' : ''
    }
    aria-disabled={disabled}
  >
    {!label || label === value || value === ipParkingOptionValue ? (
      <Text className="px-3 py-1">{label || value}</Text>
    ) : (
      <div className="flex flex-col px-3 py-1">
        <Text preset={TEXT_PRESET.paragraph}>
          {label.replace(` (${value})`, '')}
        </Text>
        <Text preset={TEXT_PRESET.caption}>{value}</Text>
      </div>
    )}
  </div>
);
