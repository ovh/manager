/* eslint-disable import/prefer-default-export */
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsFormField } from '@ovhcloud/ods-components/form-field/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import React from 'react';

export const FormField: React.FC<React.PropsWithChildren<{
  className?: string;
  label: string;
}>> = ({ children, label, className = '' }) => (
  <OsdsFormField inline className={`mb-5 ${className}`}>
    <div slot="label">
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
