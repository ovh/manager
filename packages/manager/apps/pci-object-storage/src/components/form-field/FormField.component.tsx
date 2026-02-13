import {
  Controller,
  FieldValues,
  Path,
  UseFormReturn,
  ControllerRenderProps,
} from 'react-hook-form';
import { ReactNode } from 'react';
import { Field, FieldContent, FieldError } from '@datatr-ux/uxlib';

interface FormFieldProps<T extends FieldValues, K extends Path<T>> {
  form: UseFormReturn<T>;
  name: K;
  children: (field: ControllerRenderProps<T, K>) => ReactNode;
}

const FormField = <T extends FieldValues, K extends Path<T>>({
  form,
  name,
  children,
}: FormFieldProps<T, K>) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldContent>{children(field)}</FieldContent>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
);

export { FormField };
