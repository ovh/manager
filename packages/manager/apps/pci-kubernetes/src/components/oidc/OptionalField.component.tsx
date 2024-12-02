import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { OsdsFormField, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { getErrorMessage } from '@/helpers';

type TFieldProps = {
  name: string;
  label: string;
  description?: string;
  dataTestId?: string;
  component: React.ComponentType<any>;
};

export function OptionalFormField({
  name,
  label,
  description,
  dataTestId,
  component,
  ...props
}: TFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessage(errors[name]);

  const MajComp = component;

  return (
    <OsdsFormField
      className="mt-10"
      data-testid={`${dataTestId || name}-formfield`}
      error={errorMessage}
    >
      <OsdsText
        size={ODS_TEXT_SIZE._200}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.text}
        slot="label"
      >
        {label}
      </OsdsText>
      {description && (
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_TEXT_COLOR_INTENT.text}
        >
          {description}
        </OsdsText>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <MajComp
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={errorMessage}
            {...props}
          />
        )}
      />
    </OsdsFormField>
  );
}
