import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { FormField, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { instanceNameRegex } from '@/constants';

export const nameSchema = z.string().regex(instanceNameRegex);
export const nameDefaultValue = 'default name to add';

export const Name = ({ errors, register }) => {
  const { t } = useTranslation(['common', 'creation']);

  return (
    <article className="flex flex-col w-full mb-8">
      <hr className={'h-px my-8 bg-gray-200 border-0 w-full'} />
      {/* TODO: Pre-fill name with combination of {flavor_name region_id month day hour minute} */}
      <div className="pt-3 pb-4">
        <FormField>
          <FormFieldLabel>
            {t('common:pci_instances_common_instance_name')}
          </FormFieldLabel>
          <Input {...register('name')} invalid={!!errors} className="w-full" />
        </FormField>
      </div>
      <Text
        className={clsx('text-sm', {
          'text-[--ods-color-critical-500]': !!errors,
        })}
        preset="span"
      >
        {t('creation:pci_instance_creation_name_rule')}
      </Text>
    </article>
  );
};
