import React from 'react';
import {
  OdsFormField,
  OdsSelect,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { SelectOptionsProps } from '../Form/SelectField.component';

type SelectFieldProps<T> = SelectOptionsProps<T> & {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  error?: string;
};

const getFormattedValue = (value: unknown) =>
  typeof value === 'number' ? value : String(value);

export const RhfSelectField = <T,>({
  field,
  isDisabled = false,
  isLoading,
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
      <label htmlFor={field.name} slot="label">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <OdsSelect
          key={sanitizedOptions.map((opt) => opt.value).join('-')}
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          isDisabled={isDisabled}
          className="w-full max-w-md"
          hasError={!!error}
          {...field}
          onOdsChange={field.onChange}
          onOdsBlur={field.onBlur}
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
