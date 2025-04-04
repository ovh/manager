import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsComboboxItem, OdsText } from '@ovhcloud/ods-components/react';

export type ComboboxServiceItemProps = {
  name: string;
  displayName: string;
  isDisabled?: boolean;
};

export const ComboboxServiceItem: React.FC<ComboboxServiceItemProps> = ({
  name,
  displayName,
  isDisabled,
}) => (
  <OdsComboboxItem
    className={
      isDisabled ? 'pointer-events-none cursor-not-allowed bg-gray-100' : ''
    }
    value={name}
    aria-disabled={isDisabled}
  >
    {displayName !== name ? (
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{displayName}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>{name}</OdsText>
      </div>
    ) : (
      name
    )}
  </OdsComboboxItem>
);
