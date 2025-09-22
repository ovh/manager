// src/components/RenderFormField.component.tsx
import { Controller } from 'react-hook-form';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsText } from '@ovhcloud/ods-components/react';

import { TOidcFormValues } from '@/types';

import { InputFormField } from './InputFormField.component';

const RenderFormField = ({
  name,
  label,
  description,
  error,
  control,
  placeholder,
}: {
  name: keyof TOidcFormValues;
  label: string;
  description?: string;
  error?: string;
  control: any;
  placeholder?: string;
}) => (
  <OsdsFormField class="mt-6" data-testid={`${name}-formfield`} error={error || ''}>
    <OsdsText
      size={ODS_TEXT_SIZE._200}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
      slot="label"
    >
      {label}
    </OsdsText>
    {description && (
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.text}
      >
        {description}
      </OsdsText>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <InputFormField
          name={name}
          value={value}
          onChange={onChange}
          onOdsValueChange={onChange}
          onBlur={onBlur}
          error={!!error}
          placeholder={placeholder}
          data-testid={`${name}-input`}
        />
      )}
    />
  </OsdsFormField>
);

export default RenderFormField;
