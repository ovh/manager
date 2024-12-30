import React from 'react';
import {
  OdsFormField,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';

type SelectFieldProps<T extends Record<string, unknown>> = {
  name: string;
  label: string;
  options: T[];
  optionValueKey: keyof T;
  optionLabelKey?: keyof T;
  isDisabled: boolean;
  isLoading?: boolean;
  handleChange: (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => void;
  placeholder?: string;
  error?: string;
};

export const SelectField = <T extends Record<string, unknown>>({
  name,
  isDisabled,
  isLoading,
  handleChange,
  options,
  label,
  optionLabelKey,
  optionValueKey,
  placeholder,
  error,
}: SelectFieldProps<T>) => {
  return (
    <OdsFormField error={error}>
      <label htmlFor={name} slot="label">
        <OdsText>{label}</OdsText>
      </label>
      <div className="flex items-center gap-4">
        <OdsSelect
          key={options?.map((opt) => opt[optionValueKey]).join('-')}
          id={name}
          name={name}
          placeholder={placeholder}
          isDisabled={isDisabled}
          onOdsChange={handleChange}
          className="w-full max-w-[304px]"
          hasError={!!error}
          defaultValue={
            options?.length === 1
              ? String(options[0][optionValueKey])
              : undefined
          }
        >
          {!!options?.length &&
            options.map((option) => (
              <option
                key={String(option[optionValueKey])}
                value={String(option[optionValueKey])}
              >
                {String(option[optionLabelKey] || option[optionValueKey])}
              </option>
            ))}
        </OdsSelect>
        {isLoading && <OdsSpinner size="sm" />}
      </div>
    </OdsFormField>
  );
};
