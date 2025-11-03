import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  OdsFormField,
  OdsInput,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

type TextFieldValidatorProps = Pick<
  HTMLOdsInputElement,
  'minlength' | 'maxlength' | 'pattern'
>;

export type InputFieldProps<TValues extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TValues>;
  label: string;
  error?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  validator?: TextFieldValidatorProps;
};

export const InputField = <TValues extends FieldValues = FieldValues>({
  field,
  label,
  error,
  isDisabled = false,
  isLoading = false,
  placeholder,
  validator = {},
}: InputFieldProps<TValues>) => {
  return (
    <OdsFormField error={error}>
      <label htmlFor={field.name} slot="label">
        {label}
      </label>
      <div className="flex items-center gap-x-4">
        <OdsInput
          className="w-full"
          id={field.name}
          placeholder={placeholder}
          isDisabled={isDisabled}
          hasError={!!error}
          {...validator}
          {...field}
          onOdsBlur={field.onBlur}
          onOdsChange={field.onChange}
        />
        {isLoading && <OdsSpinner size="sm" />}
      </div>

      {validator.maxlength && (
        <OdsText slot="visual-hint" preset="caption">
          {`${field.value?.length || 0}/${validator.maxlength}`}
        </OdsText>
      )}
    </OdsFormField>
  );
};
