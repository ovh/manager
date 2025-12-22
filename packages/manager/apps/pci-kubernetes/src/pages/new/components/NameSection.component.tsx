import { clsx } from 'clsx';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldHelper, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';

import { TCreateClusterSchema } from '../hooks/useCreateClusterForm/CreateClusterForm.schema';

export const NameSection = () => {
  const { t } = useTranslation('add');

  const {
    register,
    formState: {
      errors: { name: nameFieldError },
    },
  } = useFormContext<TCreateClusterSchema>();

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_name')}
      </Text>
      <FormField>
        <FormFieldLabel>{t('kubernetes_add_name_input_label')}</FormFieldLabel>
        <Input {...register('name')} className="sm:w-1/2" invalid={!!nameFieldError} />
        <FormFieldHelper
          className={clsx('mt-3 text-[--ods-color-text]', {
            'text-[--ods-theme-critical-color]': !!nameFieldError,
          })}
          aria-live={nameFieldError ? 'polite' : undefined}
        >
          {t('kubernetes_add_cluster_name_input_pattern_validation_error')}
        </FormFieldHelper>
      </FormField>
    </>
  );
};
