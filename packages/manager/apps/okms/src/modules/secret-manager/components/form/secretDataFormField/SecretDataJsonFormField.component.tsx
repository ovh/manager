import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { OdsFormField, OdsTextarea } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { SECRET_FORM_FIELD_TEST_IDS } from '../form.constants';

type FormFieldInput = {
  data: string;
};

export const SecretDataJsonFormField = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });

  return (
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
        data-testid={SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA}
      />
    </OdsFormField>
  );
};
