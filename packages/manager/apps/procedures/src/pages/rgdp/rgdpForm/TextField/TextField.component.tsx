import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Control, Controller, Validate, ValidationRule } from 'react-hook-form';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import React, { FunctionComponent } from 'react';
import { GDPRFormValues } from '@/types/gdpr.type';

type Props = {
  name: keyof GDPRFormValues;
  label: string;
  control: Control<GDPRFormValues>;
  required?: string;
  helper?: string;
  pattern?: ValidationRule<RegExp>;
  validate?:
    | Validate<string, GDPRFormValues>
    | Record<string, Validate<string, GDPRFormValues>>;
};

export const TextField: FunctionComponent<Props> = ({
  control,
  name,
  label,
  required,
  pattern,
  validate,
  helper,
}) => {
  const id = `field_id_${name}`;

  return (
    <div className="mb-8">
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
                  {label}
                </OsdsText>
              </label>
            )}
            <OsdsInput
              onOdsValueChange={onChange}
              required={Boolean(required)}
              error={Boolean(error) || undefined}
              name={name}
              onOdsInputBlur={onBlur}
              id={id}
              value={value as string}
              type={ODS_INPUT_TYPE.text}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            {helper && <OsdsText slot="helper">{helper}</OsdsText>}
          </OsdsFormField>
        )}
      />
    </div>
  );
};
