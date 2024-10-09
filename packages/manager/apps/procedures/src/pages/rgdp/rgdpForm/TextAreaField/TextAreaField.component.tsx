import { Control, Controller, Validate, ValidationRule } from 'react-hook-form';
import React, { FunctionComponent } from 'react';
import { TextArea } from '@/components/TextArea/TextArea.component';
import { GDPRFormValues } from '@/types/gdpr.type';

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
};

export const TextAreaField: FunctionComponent<Props> = ({
  control,
  name,
  label,
  required,
  pattern,
  validate,
}) => {
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
          <TextArea
            label={label}
            name={_name}
            required={Boolean(required)}
            id={`field_id_${_name}`}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            error={error?.message}
          />
        )}
      />
    </div>
  );
};
