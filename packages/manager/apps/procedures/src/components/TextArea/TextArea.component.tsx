import {
  OdsTextAreaValueChangeEvent,
  OsdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsFormField,
  OsdsText,
  OsdsTextarea,
} from '@ovhcloud/ods-components/react';
import React, { FunctionComponent } from 'react';

type Props = {
  label?: string;
  value?: string;
  onChange?: (
    event: OsdsTextareaCustomEvent<OdsTextAreaValueChangeEvent>,
  ) => void;
  onBlur?: (event: OsdsTextareaCustomEvent<void>) => void;
  name: string;
  id: string;
  error?: string;
  required?: boolean;
};

export const TextArea: FunctionComponent<Props> = ({
  label,
  error,
  id,
  onChange,
  name,
  value,
  onBlur,
  required,
}) => {
  return (
    <OsdsFormField error={error}>
      {label && (
        <label htmlFor={id} slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {label}:
          </OsdsText>
        </label>
      )}
      <OsdsTextarea
        onOdsValueChange={onChange}
        required={required}
        name={name}
        onOdsBlur={onBlur}
        id={id}
        value={value}
        color={ODS_THEME_COLOR_INTENT.primary}
      />
    </OsdsFormField>
  );
};
