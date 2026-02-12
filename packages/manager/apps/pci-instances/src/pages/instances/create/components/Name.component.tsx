import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { selectOvhInstanceName } from '../view-models/instanceNameViewModel';
import { TInstanceCreationForm } from '../CreateInstance.schema';

export const Name = () => {
  const { t } = useTranslation(['common', 'creation']);

  const {
    register,
    control,
    setValue,
    formState: {
      errors: { name: error },
    },
  } = useFormContext<TInstanceCreationForm>();

  const flavorId = useWatch({ control, name: 'flavorId' });

  const { data: ovhInstanceName } = useInstancesCatalogWithSelect({
    select: selectOvhInstanceName(flavorId),
  });

  useEffect(() => {
    if (ovhInstanceName) setValue('name', ovhInstanceName);
  }, [ovhInstanceName, setValue]);

  return (
    <article className="flex w-full flex-col">
      <Text preset="heading-2">
        {t('common:pci_instances_common_instance_name')}
      </Text>
      <div className="mt-4 pb-4 pt-3">
        <FormField className="max-w-[50%]">
          <FormFieldLabel>
            {t('common:pci_instances_common_instance_name')}
          </FormFieldLabel>
          <Input {...register('name')} invalid={!!error} className="w-full" />
        </FormField>
      </div>
      <Text
        className={clsx('text-sm', {
          'text-[--ods-color-critical-500]': !!error,
        })}
        preset="span"
      >
        {t('creation:pci_instance_creation_name_rule')}
      </Text>
    </article>
  );
};
