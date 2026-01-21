import React, { useMemo } from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Skeleton,
} from '@ovhcloud/ods-react';

import { TEXT_PRESET, Text } from '@ovh-ux/muk';

import { SelectFieldProps } from '@/components/form/select-field/SelectField.props';

export const SelectField = ({
  label,
  placeholder,
  value,
  name,
  className,
  options,
  isLoading = false,
  isDisabled = false,
  error,
  onChange,
}: SelectFieldProps) => {
  const items = useMemo(
    () =>
      options?.map(({ value: optionValue, label: optionLabel }) => ({
        label: optionLabel,
        value: optionValue,
      })) || [],
    [options],
  );

  return (
    <FormField className="my-4 w-full" invalid={!!error}>
      {isLoading ? (
        <Skeleton className={className} />
      ) : (
        <>
          {label && <FormFieldLabel htmlFor={name}>{label}</FormFieldLabel>}
          <Combobox
            className={className}
            value={value ? [value] : []}
            name={name}
            onValueChange={(detail) => {
              onChange?.(detail.value?.[0] || null);
            }}
            invalid={!!error && !isDisabled}
            disabled={isDisabled}
            items={items}
            allowCustomValue={false}
          >
            <ComboboxControl placeholder={placeholder} clearable={true} />
            <ComboboxContent />
          </Combobox>
          {error && (
            <FormFieldError>
              <Text preset={TEXT_PRESET.caption}>{error}</Text>
            </FormFieldError>
          )}
        </>
      )}
    </FormField>
  );
};
