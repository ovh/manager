import { ComponentType } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsText } from '@ovhcloud/ods-components/react';

import { getErrorMessage } from '@/helpers';

type TOptionalFormFieldProps = {
  name: string;
  label: string;
  description?: string;
  dataTestId?: string;
  placeholder: string;
  caption?: string;
  component: ComponentType<{
    name: string;
    value: string;
    onChange: (value: string | string[]) => void;
    onBlur: () => void;
    error?: boolean | string;
    placeholder?: string;
    caption?: string;
  }>;
};

export function OptionalFormField({
  name,
  label,
  description,
  dataTestId,
  component,
  placeholder,
  caption,
  ...props
}: Readonly<TOptionalFormFieldProps>) {
  const { t } = useTranslation(['oidc-provider', 'common']);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = t(getErrorMessage(errors[name]));

  return (
    <OsdsFormField
      className="mt-8"
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
        render={({ field: { onBlur, onChange, value } }) => {
          const ComponentOptional = component;
          return (
            <ComponentOptional
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errorMessage}
              placeholder={placeholder}
              caption={caption}
              {...props}
            />
          );
        }}
      />
    </OsdsFormField>
  );
}
