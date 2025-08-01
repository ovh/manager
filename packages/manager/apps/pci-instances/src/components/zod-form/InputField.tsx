import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { ComponentPropsWithoutRef, useId } from 'react';
import { Input, Label } from '@datatr-ux/uxlib';
import { ErrorText } from '@/components/zod-form/ErrorText';

export const InputField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  ...inputProps
}: { label: string; name: TName } & Omit<
  ComponentPropsWithoutRef<'input'>,
  'name' | 'id'
>) => {
  const inputId = useId();

  return (
    <div>
      <Label htmlFor={inputId}>{label}</Label>
      <Controller<TFieldValues>
        render={({ field, fieldState: { error } }) => (
          <>
            <Input {...field} id={inputId} {...inputProps} />
            {!!error && <ErrorText>{error.message}</ErrorText>}
          </>
        )}
        name={name}
      />
    </div>
  );
};
