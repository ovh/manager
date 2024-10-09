import React, { FunctionComponent } from 'react';
import { Control, Controller, Validate, ValidationRule } from 'react-hook-form';
import { TextInput } from '@/components/TextInput/TextInput.component';
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
          <TextInput
            label={label}
            name={_name}
            required={Boolean(required)}
            id={`field_id_${_name}`}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            error={error?.message}
            helper={helper}
          />
        )}
      />
    </div>
  );
};
