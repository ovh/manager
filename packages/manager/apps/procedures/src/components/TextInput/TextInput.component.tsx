import {
  ODS_INPUT_TYPE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { FunctionComponent } from 'react';

type Props = {
  label?: string;
  value?: string;
  onChange?: (
    event: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
  ) => void;
  onBlur?: (event: OsdsInputCustomEvent<void>) => void;
  name: string;
  id: string;
  error?: string;
  required?: boolean;
  helper?: string;
};

export const TextInput: FunctionComponent<Props> = ({
  label,
  error,
  id,
  onChange,
  name,
  value,
  onBlur,
  required,
  helper,
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
      <OsdsInput
        onOdsValueChange={onChange}
        required={required}
        name={name}
        onOdsInputBlur={onBlur}
        id={id}
        value={value}
        type={ODS_INPUT_TYPE.text}
        color={ODS_THEME_COLOR_INTENT.primary}
      />
      {helper && <OsdsText slot="helper">{helper}</OsdsText>}
    </OsdsFormField>
  );
};
