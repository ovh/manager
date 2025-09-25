import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { useId } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxValueChangeDetails,
  FormField,
  FormFieldLabel,
  SelectGroupItem,
  SelectItem,
} from '@ovhcloud/ods-react';
import { ErrorText } from './ErrorText';

export type SelectFieldItem = SelectItem;
export type SelectFieldGroup = SelectGroupItem;

export const ComboboxField = <
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
    <Controller<TFieldValues, TName>
      render={({
        field: { value, onChange },
        fieldState: { error, invalid },
      }) => {
        const handleChange = (changeDetails: ComboboxValueChangeDetails) =>
          onChange(changeDetails.value[0]);

        return (
          <FormField invalid={invalid}>
            <FormFieldLabel htmlFor={inputId}>{label}</FormFieldLabel>
            <Combobox
              value={value ? [value] : []}
              items={items}
              onValueChange={handleChange}
              invalid={invalid}
              allowCustomValue={false}
            >
              <ComboboxControl />
              <ComboboxContent className="max-h-52 overflow-y-scroll" />
            </Combobox>
            <ErrorText>{error?.message}</ErrorText>
          </FormField>
        );
      }}
      name={name}
    />
  );
};
