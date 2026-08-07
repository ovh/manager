import React, { forwardRef } from 'react';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { FieldError } from '@/components/FieldError/FieldError.component';

interface OrderTextFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  /** Message d'erreur déjà traduit, ou null si le champ est valide / non touché. */
  error?: string | null;
  required?: boolean;
  isDisabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

/** Champ texte du tunnel : label + astérisque requis + hint + erreur inline (ODS FormField/Input). */
const OrderTextField = forwardRef<HTMLOdsInputElement, OrderTextFieldProps>(function OrderTextField(
  {
    id,
    label,
    value,
    placeholder,
    hint,
    error,
    required = false,
    isDisabled = false,
    onChange,
    onBlur,
  },
  ref,
) {
  return (
    <OdsFormField className="block">
      <label htmlFor={id} slot="label">
        {label}
        {/* Masqué : le caractère obligatoire est porté par `isRequired`, qu'un lecteur d'écran
            annonce — un astérisque lu à la fin du libellé ne veut rien dire. */}
        {required && (
          <span aria-hidden="true" className="ml-1 text-[var(--ods-color-critical-500)]">
            *
          </span>
        )}
      </label>
      {hint && (
        <OdsText slot="helper" preset={ODS_TEXT_PRESET.caption}>
          {hint}
        </OdsText>
      )}
      <OdsInput
        ref={ref}
        className="w-full"
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        // Le `<label for>` du light DOM nomme l'hôte, pas l'`<input>` du shadow root qui reçoit
        // réellement le focus ; et aucun IDREF ne franchit la frontière, donc l'erreur ne peut être
        // rattachée au contrôle que par son nom accessible.
        ariaLabel={error ? `${label}, ${error}` : label}
        hasError={!!error}
        isDisabled={isDisabled}
        isRequired={required}
        onOdsChange={(event) => onChange(String(event.detail.value ?? ''))}
        onOdsBlur={onBlur}
      />
      <FieldError fieldId={id} message={error} />
    </OdsFormField>
  );
});

export default OrderTextField;
