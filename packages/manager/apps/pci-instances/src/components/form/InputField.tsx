import { ComponentPropsWithoutRef } from 'react';
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

export const InputField = ({
  label,
  invalid,
  errorMessage,
  ...inputProps
}: InputFieldProps) => (
  <FormField invalid={invalid}>
    <FormFieldLabel>{label}</FormFieldLabel>
    <Input {...inputProps} invalid={invalid} />
    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
  </FormField>
);
