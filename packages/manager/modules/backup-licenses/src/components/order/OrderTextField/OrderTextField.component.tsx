import React from 'react';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

interface OrderTextFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  /** Message d'erreur déjà traduit, ou null si le champ est valide / non touché. */
  error?: string | null;
  required?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

/** Champ texte du tunnel : label + astérisque requis + hint + erreur inline (ODS FormField/Input). */
export default function OrderTextField({
  id,
  label,
  value,
  placeholder,
  hint,
  error,
  required = false,
  onChange,
  onBlur,
}: OrderTextFieldProps) {
  return (
    <OdsFormField className="block" error={error ?? undefined}>
      <label htmlFor={id} slot="label">
        {label}
        {required && <span className="ml-1 text-[var(--ods-color-critical-500)]">*</span>}
      </label>
      {hint && (
        <OdsText slot="helper" preset={ODS_TEXT_PRESET.caption}>
          {hint}
        </OdsText>
      )}
      <OdsInput
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        hasError={!!error}
        onOdsChange={(event) => onChange(String(event.detail.value ?? ''))}
        onOdsBlur={onBlur}
      />
    </OdsFormField>
  );
}
