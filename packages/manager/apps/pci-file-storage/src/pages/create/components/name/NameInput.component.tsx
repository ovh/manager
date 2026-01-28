import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  Text,
} from '@ovhcloud/ods-react';

import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';

export const NameInput = () => {
  const { t } = useTranslation(['create']);

  const {
    register,
    formState: { errors },
  } = useFormContext<CreateShareFormValues>();

  const nameError = errors.shareData?.name;

  const errorMessage = useMemo(() => {
    if (!nameError?.message) return undefined;
    const message = String(nameError.message);
    switch (message) {
      case 'name_required':
        return t('create:name.error.required');
      case 'name_max_length':
        return t('create:name.error.max_length');
      case 'name_invalid_format':
        return t('create:name.error.invalid_format');
      default:
        return message;
    }
  }, [nameError, t]);

  return (
    <article className="flex w-full flex-col">
      <FormField invalid={!!errorMessage}>
        <FormFieldLabel>{t('create:name.label')}</FormFieldLabel>
        <Input {...register('shareData.name')} className="max-w-[50%]" />
        <FormFieldError>{errorMessage}</FormFieldError>
        <FormFieldHelper>
          <Text>{t('create:name.info')}</Text>
        </FormFieldHelper>
      </FormField>
    </article>
  );
};
