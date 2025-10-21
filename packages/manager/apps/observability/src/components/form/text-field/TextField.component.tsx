import React, { forwardRef } from 'react';

import {
  ODS_TEXT_PRESET,
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
  OdsTextareaChangeEventDetail,
  OdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsText, OdsTextarea } from '@ovhcloud/ods-components/react';

import { TextFieldProps } from '@/components/form/text-field/TextField.props';

type OnChangeEvent =
  | OdsInputCustomEvent<OdsInputChangeEventDetail>
  | OdsTextareaCustomEvent<OdsTextareaChangeEventDetail>;

export const TextField = forwardRef<HTMLOdsInputElement | HTMLOdsTextareaElement, TextFieldProps>(
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
    const handleValueChange = (event: OnChangeEvent) => {
      const newValue = event.detail.value as string;
      onChange?.(newValue);
    };

    return (
      <OdsFormField className={className}>
        <label htmlFor={id} slot="label">
          <OdsText preset={ODS_TEXT_PRESET.paragraph} slot="label">
            {label}
          </OdsText>
        </label>
        {type === 'textarea' ? (
          <OdsTextarea
            ref={ref as React.Ref<HTMLOdsTextareaElement>}
            id={id}
            isRequired={isRequired}
            name={name || id}
            value={value}
            placeholder={placeholder}
            rows={rows}
            onOdsChange={handleValueChange}
            onOdsBlur={onBlur}
            hasError={!!error}
          />
        ) : (
          <OdsInput
            ref={ref as React.Ref<HTMLOdsInputElement>}
            type={type}
            id={id}
            name={name || id}
            value={value}
            isRequired={isRequired}
            placeholder={placeholder}
            onOdsChange={handleValueChange}
            onOdsBlur={onBlur}
            hasError={!!error}
          />
        )}
        {error && (
          <OdsText preset={ODS_TEXT_PRESET.caption} slot="helper">
            {error}
          </OdsText>
        )}
      </OdsFormField>
    );
  },
);

TextField.displayName = 'TextField';
