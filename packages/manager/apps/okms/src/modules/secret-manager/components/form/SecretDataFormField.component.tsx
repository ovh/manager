import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { OdsFormField, OdsTextarea } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DATA_INPUT_TEST_ID } from '@secret-manager/utils/tests/secret.constants';

const DATA_PLACEHOLDER = `{"login": "admin","password": "my_secret_password"}`;

export const SecretDataFormField = <T extends Record<string, string>>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager/create']);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <OdsFormField error={fieldState.error?.message} className="w-full">
          <label htmlFor={field.name} slot="label">
            {t('data_textarea_label')}
          </label>
          <OdsTextarea
            id={field.name}
            name={field.name}
            value={field.value || ''}
            onOdsBlur={field.onBlur}
            onOdsChange={field.onChange}
            isResizable
            rows={12}
            data-testid={DATA_INPUT_TEST_ID}
            placeholder={DATA_PLACEHOLDER}
          />
        </OdsFormField>
      )}
    />
  );
};
