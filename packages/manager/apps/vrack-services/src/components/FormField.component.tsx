import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React from 'react';

export type FormFieldProps = React.PropsWithChildren<{
  className?: string;
  label: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  helperText?: string;
  visualHint?: string;
  error?: string;
}>;

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  className = '',
  fullWidth,
  isLoading,
  helperText,
  visualHint,
  error,
}) => (
  <OdsFormField
    className={`${fullWidth ? 'block' : ''} mb-5 ${className}`}
    error={error}
  >
    <div slot="label">
      {isLoading && <OdsSpinner className="mr-3" size={ODS_SPINNER_SIZE.sm} />}
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{label}</OdsText>
    </div>
    {children}
    {helperText && (
      <div slot="helper">
        <OdsText>{helperText}</OdsText>
      </div>
    )}
    {visualHint && (
      <div slot="visualHint">
        <OdsText>{visualHint}</OdsText>
      </div>
    )}
  </OdsFormField>
);
