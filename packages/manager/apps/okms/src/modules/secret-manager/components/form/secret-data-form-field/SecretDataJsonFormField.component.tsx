import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldError, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';

import { SECRET_FORM_FIELD_TEST_IDS } from '../form.constants';

export const SecretDataJsonFormField = <T extends FieldValues>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });
  const hasError = !!fieldState.error;

  return (
    <FormField className="w-full" invalid={hasError}>
      <FormFieldLabel>{t('editor')}</FormFieldLabel>
      <Textarea
        name={field.name}
        value={field.value || ''}
        onBlur={field.onBlur}
        onChange={field.onChange}
        rows={12}
        data-testid={SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA}
        className="resize font-mono text-sm"
      />
      {fieldState.error && <FormFieldError>{fieldState.error.message}</FormFieldError>}
    </FormField>
  );
};
