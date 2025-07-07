import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { useId } from 'react';
import {
  Label,
  Select,
  SelectContent,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
} from '@datatr-ux/uxlib';
import { ErrorText } from './ErrorText';

export type SelectFieldItem = { label: string; value?: string };
export type SelectFieldGroup = { label: string; items: SelectFieldItem[] };

const mapItem = (item: SelectFieldItem) => {
  const key = item.value ?? item.label;
  return (
    <SelectItem value={key} className={'pl-8'} key={key}>
      {item.label}
    </SelectItem>
  );
};

export const SelectField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  values,
}: {
  label: string;
  name: TName;
  values: (SelectFieldGroup | SelectFieldItem)[];
}) => {
  const inputId = useId();

  return (
    <div>
      <Label htmlFor={inputId}>{label}</Label>

      <Controller<TFieldValues, TName>
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <Select value={value ?? undefined} onValueChange={onChange}>
              <SelectTrigger id={inputId}>
                <SelectValue placeholder={'Région'} />
              </SelectTrigger>
              <SelectContent>
                {values.map((groupOrItem) =>
                  'items' in groupOrItem ? (
                    <SelectGroup key={groupOrItem.label}>
                      <SelectLabel className={'pl-1'}>
                        {groupOrItem.label}
                      </SelectLabel>
                      {groupOrItem.items.map(mapItem)}
                    </SelectGroup>
                  ) : (
                    mapItem(groupOrItem)
                  ),
                )}
              </SelectContent>
            </Select>
            {!!error && <ErrorText>{error.message}</ErrorText>}
          </>
        )}
        name={name}
      />
    </div>
  );
};
