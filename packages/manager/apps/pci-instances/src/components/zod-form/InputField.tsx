import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { ComponentPropsWithoutRef } from 'react';
import { ErrorText } from '@/components/zod-form/ErrorText';
import { FormField, FormFieldLabel, Input, InputProp } from '@ovhcloud/ods-react';

export const InputField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  ...inputProps
}: { label: string; name: TName } & Omit<
  ComponentPropsWithoutRef<'input'>,
  'name' | 'type'
> & Pick<InputProp, 'type'>) => {
  return (
    <FormField>
      <FormFieldLabel>{label}</FormFieldLabel>
      <Controller<TFieldValues>
        render={({ field, fieldState: { error, invalid } }) => (
          <>
            <Input {...field} {...inputProps} invalid={invalid} />
            {!!error && <ErrorText>{error.message}</ErrorText>}
          </>
        )}
        name={name}
      />
    </FormField>
  );
};
