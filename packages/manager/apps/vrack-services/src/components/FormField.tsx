/* eslint-disable import/prefer-default-export */
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsFormField } from '@ovhcloud/ods-components/form-field/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import React from 'react';

export const FormField: React.FC<React.PropsWithChildren<{
  className?: string;
  label: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}>> = ({ children, label, className = '', fullWidth, isLoading }) => (
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
