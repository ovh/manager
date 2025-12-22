import { clsx } from 'clsx';
import { Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldHelper, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';

type TNameSectionProps<FormSchema extends object> = {
  fieldName: Path<FormSchema>;
  fieldHelper: string;
};

export const NameSection = <FormSchema extends object>({
  fieldName,
  fieldHelper,
}: TNameSectionProps<FormSchema>) => {
  const { t } = useTranslation('add');

  const {
    register,
    formState: {
      errors: { [fieldName]: fieldError },
    },
  } = useFormContext<FormSchema>();

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_name')}
      </Text>
      <FormField>
        <FormFieldLabel>{t('kubernetes_add_name_input_label')}</FormFieldLabel>
        <Input {...register(fieldName)} className="sm:w-1/2" invalid={!!fieldError} />
        <FormFieldHelper
          className={clsx('mt-3 text-[--ods-color-text]', {
            'text-[--ods-theme-critical-color]': !!fieldError,
          })}
          aria-live={fieldError ? 'polite' : undefined}
        >
          {fieldHelper}
        </FormFieldHelper>
      </FormField>
    </>
  );
};
