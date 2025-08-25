import React from 'react';
import {
  OdsFormField,
  OdsText,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  OdsToggleChangeEvent,
  OdsToggleChangeEventDetail,
  OdsToggleCustomEvent,
} from '@ovhcloud/ods-components';
import { FormKey } from '@/types/form.type';
import { testIds } from '@/utils/testIds.constants';

type ToggleFieldProps = {
  name: FormKey;
  label: string;
  checked: boolean;
  onOdsChange: (e: OdsToggleChangeEvent) => void;
  tooltip?: string;
  isDisabled?: boolean;
};

// OdsToggle web component seems to have an issue where the new value is not always detected
// As a temporary solution, the value is kept in sync with an internal state.
// TODO: ODS migration
export const ToggleField = ({
  name,
  label,
  checked,
  onOdsChange,
  tooltip,
  isDisabled = false,
}: ToggleFieldProps) => {
  const [internalChecked, setInternalChecked] = React.useState(!!checked);

  React.useEffect(() => {
    setInternalChecked(!!checked);
  }, [checked]);

  const toggleId = `${name}-toggle`;
  return (
    <OdsFormField
      key={`${toggleId}-${internalChecked}`}
      className="w-full max-w-md flex flex-row items-center gap-x-2"
    >
      <label htmlFor={toggleId} slot="label">
        <OdsText>{label}</OdsText>
      </label>
      <OdsToggle
        id={toggleId}
        name={name}
        value={internalChecked}
        isDisabled={isDisabled}
        onOdsChange={(e: OdsToggleCustomEvent<OdsToggleChangeEventDetail>) => {
          const newValue = !!e.detail.value;
          setInternalChecked(newValue);
          onOdsChange(e);
        }}
        className="ml-auto"
        data-testid={testIds.toggleFieldInput}
      />
      {tooltip && <OdsTooltip triggerId={toggleId}>{tooltip}</OdsTooltip>}
    </OdsFormField>
  );
};
