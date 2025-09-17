import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { useId } from 'react';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectGroupItem,
  SelectItem,
} from '@ovhcloud/ods-react';
import { ErrorText } from './ErrorText';

export type SelectFieldItem = SelectItem;
export type SelectFieldGroup = SelectGroupItem;

export const SelectField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  items,
}: {
  label: string;
  name: TName;
  items: (SelectItem | SelectGroupItem)[];
}) => {
  const inputId = useId();

  return (
    <FormField>
      <FormFieldLabel htmlFor={inputId}>{label}</FormFieldLabel>

      <Controller<TFieldValues, TName>
        render={({
          field: { value, onChange },
          fieldState: { error, invalid },
        }) => (
          <>
            <Select
              value={value ? [value] : []}
              items={items}
              onValueChange={(changeDetails) =>
                onChange(changeDetails.value?.[0])
              }
              invalid={invalid}
            >
              <SelectControl />
              <SelectContent />
            </Select>
            {!!error && <ErrorText>{error.message}</ErrorText>}
          </>
        )}
        name={name}
      />
    </FormField>
  );
};
