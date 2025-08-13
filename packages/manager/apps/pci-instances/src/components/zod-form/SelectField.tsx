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
  SelectValueChangeDetail,
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
        }) => {
          const handleChange = (changeDetails: SelectValueChangeDetail) =>
            onChange(changeDetails.value[0]);

          return (
            <>
              <Select
                value={value ? [value] : []}
                items={items}
                onValueChange={handleChange}
                invalid={invalid}
              >
                <SelectControl />
                <SelectContent />
              </Select>
              {!!error && <ErrorText>{error.message}</ErrorText>}
            </>
          );
        }}
        name={name}
      />
    </FormField>
  );
};
