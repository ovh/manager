import React from 'react';
import {
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { OdsInputChangeEvent, OdsInputType } from '@ovhcloud/ods-components';

export type TextFieldProps = {
  name: string;
  value: string;
  onOdsChange: (e: OdsInputChangeEvent) => void;
  type?: OdsInputType;
  label?: string;
  placeholder?: string;
  pattern?: string;
  error?: string;
  helperText?: string;
  minlength?: number;
  maxlength?: number;
  isRequired?: boolean;
};

export const TextField: React.FC<TextFieldProps> = ({
  name,
  type = 'text',
  label,
  error,
  helperText,
  ...props
}) => {
  const commonInputProps = {
    name,
    id: name,
    hasError: !!error,
    className: 'w-full',
    ...props,
  };

  return (
    <OdsFormField key={name} className="w-full max-w-md" error={error}>
      {label && (
        <label htmlFor={name} slot="label">
          <OdsText>{label}</OdsText>
        </label>
      )}
      {type === 'password' ? (
        <OdsPassword {...commonInputProps} />
      ) : (
        <OdsInput type={type} {...commonInputProps} />
      )}
      {helperText && (
        <OdsText slot="helper" preset="caption" class="ods-field-helper">
          {helperText}
        </OdsText>
      )}
      {props.maxlength && (
        <OdsText slot="visual-hint" preset="caption">
          {`${props.value?.length || 0}/${props.maxlength}`}
        </OdsText>
      )}
    </OdsFormField>
  );
};
