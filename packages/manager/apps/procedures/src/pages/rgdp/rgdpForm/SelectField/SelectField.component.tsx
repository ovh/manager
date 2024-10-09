import { Control, Controller, Validate, ValidationRule } from 'react-hook-form';
import React, { FunctionComponent } from 'react';
import { Select, SelectOption } from '@/components/Select/Select.component';
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
          <Select
            label={label}
            name={_name}
            required={Boolean(required)}
            id={`field_id_${_name}`}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            options={options}
            placeholder={placeholder}
            error={error?.message}
          />
        )}
      />
    </div>
  );
};
