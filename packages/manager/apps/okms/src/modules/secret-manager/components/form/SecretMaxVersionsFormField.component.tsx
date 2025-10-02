import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import {
  OdsText,
  OdsFormField,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  MAX_VERSIONS_MAX_VALUE,
  MAX_VERSIONS_MIN_VALUE,
} from '@secret-manager/validation/metadata/metadataSchema';
import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

type FormFieldInput = {
  maxVersions: number;
};

export const SecretMaxVersionsFormField = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation('secret-manager');
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
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
            {t('form_helper_max_versions')}
          </OdsText>
        </OdsFormField>
      )}
    />
  );
};
