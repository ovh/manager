import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldError, FormFieldHelper, Input, Text } from '@ovhcloud/ods-react';

export const SecretPathFormField = <T extends FieldValues>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });

  return (
    <FormField invalid={!!fieldState.error}>
      <Input
        id={name}
        name={name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={field.onChange}
        data-testid={SECRET_FORM_TEST_IDS.INPUT_PATH}
      />
      <FormFieldHelper>
        <Text preset="caption">{t('path_field_helper')}</Text>
      </FormFieldHelper>
      {fieldState.error?.message && <FormFieldError>{fieldState.error?.message}</FormFieldError>}
    </FormField>
  );
};
