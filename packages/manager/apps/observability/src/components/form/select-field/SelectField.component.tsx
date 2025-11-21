import React, { useMemo } from 'react';

import { FormField, FormFieldHelper, FormFieldLabel, Skeleton } from '@ovhcloud/ods-react';

import { Select, SelectContent, SelectControl, TEXT_PRESET, Text } from '@ovh-ux/muk';

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
    <FormField className="my-4 w-full">
      {isLoading ? (
        <Skeleton className={className} />
      ) : (
        <>
          {label && (
            <FormFieldLabel htmlFor={name}>
              <Text preset={TEXT_PRESET.paragraph}>{label}</Text>
            </FormFieldLabel>
          )}
          <Select
            className={className}
            fitControlWidth={true}
            value={value ? [value] : []}
            name={name}
            onValueChange={(detail) => {
              onChange?.(detail.value?.[0] || null);
            }}
            invalid={!!error && !isDisabled}
            disabled={isDisabled}
            items={items}
          >
            <SelectControl placeholder={placeholder} />
            <SelectContent />
          </Select>
          {error && (
            <FormFieldHelper>
              <Text preset={TEXT_PRESET.caption}>{error}</Text>
            </FormFieldHelper>
          )}
        </>
      )}
    </FormField>
  );
};
