import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { OdsFormField, OdsTextarea } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { SECRET_INPUT_DATA_TEST_ID } from './SecretDataFormField.constants';

export const SecretDataFormField = <T extends Record<string, string>>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation('secret-manager');
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <OdsFormField error={fieldState.error?.message} className="w-full">
          <label htmlFor={field.name} slot="label">
            {t('editor')}
          </label>
          <OdsTextarea
            id={field.name}
            name={field.name}
            value={field.value || ''}
            onOdsBlur={field.onBlur}
            onOdsChange={field.onChange}
            isResizable
            rows={12}
            data-testid={SECRET_INPUT_DATA_TEST_ID}
          />
        </OdsFormField>
      )}
    />
  );
};
