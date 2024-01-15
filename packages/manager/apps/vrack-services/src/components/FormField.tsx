import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React from 'react';

export type FormFieldProps = React.PropsWithChildren<{
  className?: string;
  label: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}>;

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  className = '',
  fullWidth,
  isLoading,
}) => (
  <OsdsFormField
    inline={!fullWidth || undefined}
    className={`mb-5 ${className}`}
  >
    <div slot="label">
      {isLoading && (
        <OsdsSpinner className="mr-3" inline size={ODS_SPINNER_SIZE.sm} />
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
      >
        {label}
      </OsdsText>
    </div>
    {children}
  </OsdsFormField>
);
