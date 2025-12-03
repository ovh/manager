import {
  MAX_VERSIONS_MAX_VALUE,
  MAX_VERSIONS_MIN_VALUE,
} from '@secret-manager/validation/secret-config/secretConfigSchema';
import { UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsQuantity, OdsText } from '@ovhcloud/ods-components/react';

import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

type FormFieldInput = {
  maxVersions: number;
};

type SecretMaxVersionsFormFieldProps<T extends FormFieldInput> = UseControllerProps<T> & {
  defaultMaxVersions: number;
};

export const SecretMaxVersionsFormField = <T extends FormFieldInput>({
  name,
  control,
  defaultMaxVersions,
}: SecretMaxVersionsFormFieldProps<T>) => {
  const { t } = useTranslation('secret-manager');
  const { field, fieldState } = useController({ name, control });

  return (
    <OdsFormField error={fieldState.error?.message}>
      <label htmlFor={field.name} slot="label" className="mb-1">
        {t('maximum_number_of_versions')}
      </label>
      <OdsQuantity
        id={field.name}
        name={field.name}
        value={Number(field.value)}
        onOdsBlur={field.onBlur}
        onOdsChange={field.onChange}
        data-testid={SECRET_FORM_FIELD_TEST_IDS.MAX_VERSIONS}
        min={MAX_VERSIONS_MIN_VALUE}
        max={MAX_VERSIONS_MAX_VALUE}
        className="justify-start"
      />
      <OdsText slot="helper" preset="caption">
        {t('form_helper_max_versions', { default: defaultMaxVersions })}
      </OdsText>
    </OdsFormField>
  );
};
