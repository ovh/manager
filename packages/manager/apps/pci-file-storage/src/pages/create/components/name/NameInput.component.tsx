import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';

import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';

export const NameInput = () => {
  const { t } = useTranslation(['create']);

  const {
    register,
    formState: {
      errors: { shareData: { name: nameError } = {} },
    },
  } = useFormContext<CreateShareFormValues>();

  const errorMessage = useMemo(() => {
    if (!nameError) return undefined;
    switch (nameError.message) {
      case 'name_required':
        return t('create:name.error.required');
      case 'name_max_length':
        return t('create:name.error.max_length');
      case 'name_invalid_format':
        return t('create:name.error.invalid_format');
      default:
        return nameError.message;
    }
  }, [nameError, t]);

  return (
    <article className="flex w-full flex-col">
      <div className="mt-4 pb-4 pt-3">
        <FormField className="max-w-[50%]">
          <FormFieldLabel>{t('create:name.label')}</FormFieldLabel>
          <Input {...register('shareData.name')} invalid={!!errorMessage} className="w-full" />
        </FormField>
      </div>
      {!!errorMessage && (
        <Text className="text-sm text-[--ods-color-critical-500]" preset="span">
          {errorMessage}
        </Text>
      )}
      <Text preset="span">{t('create:name.info')}</Text>
    </article>
  );
};
