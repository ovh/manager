import { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  FormField,
  FormFieldLabel,
  Input,
  InputProp,
} from '@ovhcloud/ods-react';
import { ErrorText } from './ErrorText';

type InputFieldProps = {
  label: string;
  invalid: boolean;
  errorMessage?: string;
} & Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
  Pick<InputProp, 'type'>;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, invalid, errorMessage, ...inputProps }, ref) => (
    <FormField invalid={invalid}>
      <FormFieldLabel>{label}</FormFieldLabel>
      <Input ref={ref} {...inputProps} invalid={invalid} />
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </FormField>
  ),
);

InputField.displayName = 'InputField';
