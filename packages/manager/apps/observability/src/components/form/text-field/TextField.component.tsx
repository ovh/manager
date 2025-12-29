import React, { RefObject, forwardRef, useState } from 'react';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  TEXT_PRESET,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';

import { TextFieldProps } from '@/components/form/text-field/TextField.props';
import { DESCRIPTION_MAX_CHARS } from '@/utils/schemas/description.schema';

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
      className = 'my-6 w-full',
      isRequired = false,
      isDisabled = false,
      onChange,
      onBlur,
      error,
      helper,
    },
    ref,
  ) => {
    const [count, setCount] = useState(0);
    const handleValueChange = (event: React.ChangeEvent<TextFieldRefElement>) => {
      const newValue = event.target.value;
      onChange?.(newValue);
    };
    const onInput = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setCount(event.target.value.length);

    const isTextarea = type === 'textarea';

    return (
      <FormField className={className} invalid={!!error}>
        <FormFieldLabel htmlFor={name || id}>
          <Text preset={TEXT_PRESET.paragraph}>{label}</Text>
        </FormFieldLabel>
        {isTextarea ? (
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
            disabled={isDisabled}
            onInput={onInput}
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
            disabled={isDisabled}
          />
        )}
        <FormFieldHelper className="flex justify-between">
          <Text preset={TEXT_PRESET.caption}>{helper}</Text>
          {isTextarea && (
            <Text preset={TEXT_PRESET.caption}>
              {count}/{DESCRIPTION_MAX_CHARS}
            </Text>
          )}
        </FormFieldHelper>
        <FormFieldError>
          <Text preset={TEXT_PRESET.label} className="text-[--ods-color-error-500]">
            {error}
          </Text>
        </FormFieldError>
      </FormField>
    );
  },
);

TextField.displayName = 'TextField';
