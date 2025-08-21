import { useTranslation } from 'react-i18next';
import { FormField, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

export const nameDefaultValue = 'default name to add';

export const Name = () => {
  const { t } = useTranslation(['common', 'creation']);

  const {
    register,
    formState: {
      errors: { name: error },
    },
  } = useFormContext<{ name: string }>();

  return (
    <article className="flex flex-col w-full mb-8">
      <hr className={'h-px my-8 bg-gray-200 border-0 w-full'} />
      {/* TODO: Pre-fill name with combination of {flavor_name region_id month day hour minute} */}
      <div className="pt-3 pb-4">
        <FormField>
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
