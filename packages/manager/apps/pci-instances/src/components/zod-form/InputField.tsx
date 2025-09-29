import { ComponentPropsWithoutRef } from 'react';
import {
  FormField,
  FormFieldLabel,
  Input,
  InputProp,
} from '@ovhcloud/ods-react';
import { ErrorText } from '@/components/zod-form/ErrorText';

export const InputField = ({
  label,
  invalid,
  errorMessage,
  ...inputProps
}: { label: string; invalid: boolean; errorMessage?: string } & Omit<
  ComponentPropsWithoutRef<'input'>,
  'type'
> &
  Pick<InputProp, 'type'>) => (
  <FormField>
    <FormFieldLabel>{label}</FormFieldLabel>
    <Input {...inputProps} invalid={invalid} />
    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
  </FormField>
);
