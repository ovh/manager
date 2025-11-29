import { ReactNode } from 'react';

import { Controller } from 'react-hook-form';
import type { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';

import {
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  FormField as MUKFormField,
} from '@ovh-ux/muk';

interface FormFieldProps<T extends FieldValues, K extends Path<T>> {
  form: UseFormReturn<T>;
  name: K;
  label?: ReactNode;
  helper?: ReactNode;
  children: (field: ControllerRenderProps<T, K>) => ReactNode;
}

export function FormField<T extends FieldValues, K extends Path<T>>({
  form,
  name,
  label,
  helper,
  children,
}: FormFieldProps<T, K>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <MUKFormField>
          {label && <FormFieldLabel>{label}</FormFieldLabel>}
          {children(field)}
          {fieldState.error && <FormFieldError>{fieldState.error.message}</FormFieldError>}
          {helper && !fieldState.error && <FormFieldHelper>{helper}</FormFieldHelper>}
        </MUKFormField>
      )}
    />
  );
}
