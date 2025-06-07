import React from 'react';
import {
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { OdsInputChangeEvent, OdsInputType } from '@ovhcloud/ods-components';
import { FormKey } from '@/types/form.type';

type TextFieldValidatorProps = {
  pattern?: string;
  minlength?: number;
  maxlength?: number;
  isRequired?: boolean;
};

export type TextFieldProps = {
  name: FormKey;
  value: string;
  label: string;
  onOdsChange: (e: OdsInputChangeEvent) => void;
  type?: OdsInputType;
  placeholder?: string;
  error?: string;
  helperText?: string;
  validator?: TextFieldValidatorProps;
};

export const TextField: React.FC<TextFieldProps> = ({
  name,
  type = 'text',
  label,
  error,
  helperText,
  validator = {},
  ...props
}) => {
  const commonInputProps = {
    name,
    id: name,
    hasError: !!error,
    className: 'w-full',
    ...validator,
    ...props,
  };

  return (
    <OdsFormField key={name} className="w-full max-w-md" error={error}>
      <label htmlFor={name} slot="label">
        <OdsText>{label}</OdsText>
      </label>
      {type === 'password' ? (
        <OdsPassword {...commonInputProps} />
      ) : (
        <OdsInput type={type} {...commonInputProps} />
      )}
      {helperText && helperText !== error && (
        <OdsText slot="helper" preset="caption" class="ods-field-helper">
          {helperText}
        </OdsText>
      )}
      {validator.maxlength && (
        <OdsText slot="visual-hint" preset="caption">
          {`${props.value?.length || 0}/${validator.maxlength}`}
        </OdsText>
      )}
    </OdsFormField>
  );
};
