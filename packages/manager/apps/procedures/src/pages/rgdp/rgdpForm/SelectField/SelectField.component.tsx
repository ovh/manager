import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { Control, Controller, Validate, ValidationRule } from 'react-hook-form';
import React, { FunctionComponent } from 'react';
import { GDPRFormValues } from '@/types/gdpr.type';

export type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  name: keyof GDPRFormValues;
  label?: string;
  control: Control<GDPRFormValues>;
  required?: string;
  helper?: string;
  pattern?: ValidationRule<RegExp>;
  validate?:
    | Validate<string, GDPRFormValues>
    | Record<string, Validate<string, GDPRFormValues>>;
  options: SelectOption[];
  placeholder: string;
};

export const SelectField: FunctionComponent<Props> = ({
  control,
  name,
  label,
  required,
  pattern,
  validate,
  options,
  placeholder,
}) => {
  const id = `field_id_${name}`;

  return (
    <div>
      <Controller
        control={control}
        name={name}
        rules={{
          required,
          pattern,
          validate,
        }}
        render={({
          field: { onChange, onBlur, value, name: _name },
          fieldState: { error },
        }) => (
          <OsdsFormField error={error?.message}>
            {label && (
              <label htmlFor={id} slot="label">
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  {label} :
                </OsdsText>
              </label>
            )}
            <OsdsSelect
              onOdsValueChange={onChange}
              onBlur={onBlur}
              value={value as string}
              name={name}
              required={Boolean(required)}
              id={id}
              error={Boolean(error) || undefined}
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
        )}
      />
    </div>
  );
};
