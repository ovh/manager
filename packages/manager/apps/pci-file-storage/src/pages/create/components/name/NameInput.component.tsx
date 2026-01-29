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
    formState: {
      errors: { shareData: { name: nameError } = {} },
    },
  } = useFormContext<CreateShareFormValues>();

  return (
    <article className="flex w-full flex-col">
      <FormField invalid={!!nameError}>
        <FormFieldLabel>{t('create:name.label')}</FormFieldLabel>
        <Input {...register('shareData.name')} className="max-w-[50%]" />
        <FormFieldError>{t(`create:name.error.${nameError?.type}`)}</FormFieldError>
        <FormFieldHelper>
          <Text>{t('create:name.info')}</Text>
        </FormFieldHelper>
      </FormField>
    </article>
  );
};
