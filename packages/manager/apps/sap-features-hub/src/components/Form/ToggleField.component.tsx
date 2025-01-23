import React from 'react';
import {
  OdsFormField,
  OdsText,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import { OdsToggleChangeEvent } from '@ovhcloud/ods-components';
import { FormKey } from '@/types/form.type';
import { testIds } from '@/utils/testIds.constants';

export type ToggleFieldProps = {
  name: FormKey;
  label: string;
  checked: boolean;
  onOdsChange: (e: OdsToggleChangeEvent) => void;
  tooltip?: string;
};

export const ToggleField = ({
  name,
  label,
  checked,
  onOdsChange,
  tooltip,
}: ToggleFieldProps) => {
  const toggleId = `${name}-toggle`;
  return (
    <OdsFormField
      key={toggleId}
      className="w-full max-w-md flex flex-row items-center gap-x-2"
    >
      <label htmlFor={toggleId} slot="label">
        <OdsText>{label}</OdsText>
      </label>
      <OdsToggle
        id={toggleId}
        name={name}
        value={checked}
        onOdsChange={onOdsChange}
        className="ml-auto"
        data-testid={testIds.toggleFieldInput}
      />
      {tooltip && <OdsTooltip triggerId={toggleId}>{tooltip}</OdsTooltip>}
    </OdsFormField>
  );
};
