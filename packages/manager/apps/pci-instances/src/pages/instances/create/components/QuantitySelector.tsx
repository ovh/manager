import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import clsx from 'clsx';
import {
  FormField,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
  Text,
} from '@ovhcloud/ods-react';

const rules = {
  min: 1,
  max: 5,
};

export const quantitySchema = z
  .number()
  .min(rules.min)
  .max(rules.max);
export const quantityDefaultValue = 1;

type Props = {
  quota: number;
  type: string;
  region: string;
};

export const QuantitySelector = ({ quota, type, region }: Props) => {
  const { t } = useTranslation('creation');

  const {
    formState: {
      errors: { quantity: error },
    },
  } = useFormContext<{ quantity: number }>();

  return (
    <article className="flex flex-col w-full mb-8">
      <hr className={'h-px my-8 bg-gray-200 border-0 w-full'} />
      <Text preset="heading-2">
        {t('pci_instances_creation_quantity_title')}
      </Text>
      <div className="pt-3 pb-4">
        <FormField>
          <FormFieldLabel>
            {t('pci_instances_creation_quantity_label')}
          </FormFieldLabel>
          <Controller
            name="quantity"
            render={({ field }) => (
              <Quantity
                min={rules.min}
                max={rules.max}
                invalid={!!error}
                onValueChange={({ value }) => field.onChange(Number(value))}
                defaultValue={String(quantityDefaultValue)}
                required
              >
                <QuantityControl>
                  <QuantityInput value={String(field.value)} />
                </QuantityControl>
              </Quantity>
            )}
          />
        </FormField>
      </div>
      <Text
        className={clsx('text-sm', {
          'text-[--ods-color-critical-500]': !!error,
        })}
        preset="span"
      >
        {t('pci_instance_creation_quantity_rule', { quota, type, region })}
      </Text>
    </article>
  );
};
