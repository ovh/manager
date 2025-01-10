import React from 'react';
import {
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { OdsInputChangeEvent, OdsInputType } from '@ovhcloud/ods-components';

type TextFieldProps = {
  name: string;
  value: string;
  onChange: (e: OdsInputChangeEvent) => void;
  type?: OdsInputType;
  label?: string;
  placeholder?: string;
  pattern?: string;
  error?: string;
  helperText?: string;
};

export const TextField: React.FC<TextFieldProps> = ({
  name,
  value,
  onChange,
  type = 'text',
  label,
  error,
  placeholder,
  pattern,
  helperText,
}) => {
  const commonProps = {
    name,
    id: name,
    value,
    onOdsChange: onChange,
    placeholder,
    pattern,
    hasError: !!error,
    className: 'w-full',
  };

  return (
    <OdsFormField key={name} className="w-full max-w-[19em]" error={error}>
      {label && (
        <label htmlFor={name} slot="label">
          <OdsText>{label}</OdsText>
        </label>
      )}
      {type === 'password' ? (
        <OdsPassword {...commonProps} />
      ) : (
        <OdsInput type={type} {...commonProps} />
      )}
      {helperText && <OdsText slot="helper">{helperText}</OdsText>}
    </OdsFormField>
  );
};
