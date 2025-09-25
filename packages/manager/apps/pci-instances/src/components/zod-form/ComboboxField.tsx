import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { useId } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxGroupItem,
  ComboboxItem,
  ComboboxValueChangeDetails,
  FormField,
  FormFieldLabel,
} from '@ovhcloud/ods-react';
import { ErrorText } from './ErrorText';

export type ComboboxFieldItem = ComboboxItem;
export type ComboboxFieldGroup = ComboboxGroupItem;

export const ComboboxField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  items,
  allowCustomValue = false,
}: {
  label: string;
  name: TName;
  items: (ComboboxFieldItem | ComboboxFieldGroup)[];
  allowCustomValue?: boolean;
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
              allowCustomValue={allowCustomValue}
            >
              <ComboboxControl />
              <ComboboxContent className="max-h-52 overflow-y-scroll" />
            </Combobox>
            {error && <ErrorText>{error?.message}</ErrorText>}
          </FormField>
        );
      }}
      name={name}
    />
  );
};
