import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  OdsFormField,
  OdsIcon,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  OdsToggleChangeEventDetail,
  OdsToggleCustomEvent,
} from '@ovhcloud/ods-components';

type RhfToggleFieldProps<TFieldName extends string> = {
  field: ControllerRenderProps<FieldValues, TFieldName>;
  label: string;
  tooltip?: string;
};

// OdsToggle web component seems to have an issue where the new value is not always detected
// As a temporary solution, the value is kept in sync with an internal state.
// TODO: ODS migration
export const RhfToggleField = <TFieldName extends string>({
  field,
  label,
  tooltip,
}: RhfToggleFieldProps<TFieldName>) => {
  const { name, value, onChange, onBlur } = field;
  const [internalChecked, setInternalChecked] = React.useState(!!value);

  const toggleId = `${field.name}-toggle`;

  React.useEffect(() => {
    setInternalChecked(!!value);
  }, [value]);

  return (
    <OdsFormField
      key={`${toggleId}-${internalChecked}`}
      className="w-full max-w-md flex flex-row items-center gap-x-2"
    >
      <label
        htmlFor={toggleId}
        slot="label"
        className="flex items-center gap-2"
      >
        {label}
        {tooltip && (
          <>
            <OdsIcon name="circle-question" id={toggleId} />
            <OdsTooltip triggerId={toggleId}>{tooltip}</OdsTooltip>
          </>
        )}
      </label>
      <OdsToggle
        className="ml-auto"
        name={name}
        value={internalChecked}
        onOdsBlur={onBlur}
        onOdsChange={(e: OdsToggleCustomEvent<OdsToggleChangeEventDetail>) => {
          const newValue = !!e.detail.value;
          setInternalChecked(newValue);
          onChange(newValue);
        }}
      />
    </OdsFormField>
  );
};
