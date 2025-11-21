import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  OdsFormField,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

type SelectFieldProps<TValues extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TValues>;
  options: string[];
  label: string;
  error?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  helperText?: string;
};

export const SelectField = <TValues extends FieldValues = FieldValues>({
  field,
  options = [],
  label,
  error,
  isDisabled = false,
  isLoading = false,
  placeholder,
  helperText,
}: SelectFieldProps<TValues>) => {
  return (
    <OdsFormField error={error}>
      <label htmlFor={field.name} slot="label">
        {label}
      </label>
      <div className="flex items-center gap-x-4">
        <OdsSelect
          className="w-full"
          id={field.name}
          placeholder={placeholder}
          isDisabled={isDisabled}
          hasError={!!error}
          {...field}
          onOdsBlur={field.onBlur}
          onOdsChange={field.onChange}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </OdsSelect>
        {isLoading && <OdsSpinner size="sm" />}
      </div>
      {helperText && (
        <OdsText slot="helper" preset="caption">
          {helperText}
        </OdsText>
      )}
    </OdsFormField>
  );
};
