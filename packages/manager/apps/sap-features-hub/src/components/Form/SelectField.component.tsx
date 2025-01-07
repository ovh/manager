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

type SelectOptionsProps<T> = T extends Record<string, unknown>
  ? {
      options: T[];
      optionValueKey: keyof T;
      optionLabelKey?: keyof T;
    }
  : {
      options: string[] | number[];
      optionValueKey?: never;
      optionLabelKey?: never;
    };

type SelectFieldProps<T> = SelectOptionsProps<T> & {
  name: string;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  handleChange: (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => void;
  placeholder?: string;
  error?: string;
};

const getFormattedValue = (value: unknown) =>
  typeof value === 'number' ? value : String(value);

export const SelectField = <T,>({
  name,
  isDisabled = false,
  isLoading,
  handleChange,
  options = [],
  label,
  optionLabelKey,
  optionValueKey,
  placeholder,
  error,
}: SelectFieldProps<T>) => {
  const sanitizedOptions = options.map((opt) =>
    typeof opt === 'object'
      ? {
          value: opt?.[optionValueKey] || '',
          label: String(opt?.[optionLabelKey] || opt?.[optionValueKey] || ''),
        }
      : { value: opt, label: String(opt) },
  );

  return (
    <OdsFormField error={error}>
      <label htmlFor={name} slot="label">
        <OdsText>{label}</OdsText>
      </label>
      <div className="flex items-center gap-4">
        <OdsSelect
          key={sanitizedOptions.map((opt) => opt.value).join('-')}
          id={name}
          name={name}
          placeholder={placeholder}
          isDisabled={isDisabled}
          onOdsChange={handleChange}
          className="w-full max-w-[304px]"
          hasError={!!error}
          defaultValue={
            !isLoading && sanitizedOptions.length === 1
              ? String(sanitizedOptions[0].value)
              : undefined
          }
        >
          {sanitizedOptions.map((opt) => (
            <option
              key={getFormattedValue(opt.value)}
              value={getFormattedValue(opt.value)}
            >
              {opt.label}
            </option>
          ))}
        </OdsSelect>
        {isLoading && <OdsSpinner size="sm" />}
      </div>
    </OdsFormField>
  );
};
