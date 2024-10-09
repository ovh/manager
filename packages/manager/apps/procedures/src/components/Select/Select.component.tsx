import {
  ODS_INPUT_TYPE,
  OdsInputValueChangeEventDetail,
  OdsSelectValueChangeEventDetail,
  OsdsInputCustomEvent,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { FunctionComponent } from 'react';

export type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  value?: string;
  onChange?: (
    event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => void;
  onBlur?: React.FocusEventHandler<HTMLOsdsSelectElement>;
  name: string;
  id: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
};

export const Select: FunctionComponent<Props> = ({
  label,
  error,
  id,
  onChange,
  name,
  value,
  onBlur,
  required,
  placeholder,
  options,
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

      <OsdsSelect
        onOdsValueChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
        required={required}
        id={id}
        inline
      >
        {placeholder && <span slot="placeholder">{placeholder}</span>}
        {options.map((option, index) => (
          <OsdsSelectOption value={option.value} key={index}>
            {option.label}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
    </OsdsFormField>
  );
};
