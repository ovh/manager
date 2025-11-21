import React, { RefObject, forwardRef } from 'react';

import { FormField, FormFieldHelper, FormFieldLabel, Input, Textarea } from '@ovhcloud/ods-react';

import { TEXT_PRESET, Text } from '@ovh-ux/muk';

import { TextFieldProps } from '@/components/form/text-field/TextField.props';

type TextFieldRefElement = HTMLInputElement | HTMLTextAreaElement;

export const TextField = forwardRef<TextFieldRefElement, TextFieldProps>(
  (
    {
      id,
      name,
      label,
      type = 'text',
      value,
      placeholder,
      rows = 4,
      className = 'my-4 w-full',
      isRequired = false,
      onChange,
      onBlur,
      error,
    },
    ref,
  ) => {
    const handleValueChange = (event: React.ChangeEvent<TextFieldRefElement>) => {
      const newValue = event.target.value;
      onChange?.(newValue);
    };

    return (
      <FormField className={className}>
        <FormFieldLabel htmlFor={name || id}>
          <Text preset={TEXT_PRESET.paragraph}>{label}</Text>
        </FormFieldLabel>
        {type === 'textarea' ? (
          <Textarea
            ref={ref as RefObject<HTMLTextAreaElement>}
            id={id}
            required={isRequired}
            name={name || id}
            value={value}
            placeholder={placeholder}
            rows={rows}
            onChange={handleValueChange}
            onBlur={onBlur}
            invalid={!!error}
          />
        ) : (
          <Input
            ref={ref as RefObject<HTMLInputElement>}
            type={type}
            id={id}
            name={name || id}
            value={value}
            required={isRequired}
            placeholder={placeholder}
            onChange={handleValueChange}
            onBlur={onBlur}
            invalid={!!error}
          />
        )}
        {error && (
          <FormFieldHelper>
            <Text preset={TEXT_PRESET.caption}>{error}</Text>
          </FormFieldHelper>
        )}
      </FormField>
    );
  },
);

TextField.displayName = 'TextField';
