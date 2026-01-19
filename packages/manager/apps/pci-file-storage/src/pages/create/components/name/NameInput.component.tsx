import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';

import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';

export const NameInput = () => {
  const { t } = useTranslation(['create']);

  const {
    register,
    formState: {
      errors: { shareData },
    },
  } = useFormContext<CreateShareFormValues>();

  const error = shareData?.name;

  return (
    <article className="flex w-full flex-col">
      <div className="mt-4 pb-4 pt-3">
        <FormField className="max-w-[50%]">
          <FormFieldLabel>{t('create:name.label')}</FormFieldLabel>
          <Input {...register('shareData.name')} invalid={!!error} className="w-full" />
        </FormField>
      </div>
      <Text
        className={clsx('text-sm', {
          'text-[--ods-color-critical-500]': !!error,
        })}
        preset="span"
      >
        {t('create:name.info')}
      </Text>
    </article>
  );
};
