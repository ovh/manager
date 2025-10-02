import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import {
  FormField,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
  Text,
} from '@ovhcloud/ods-react';
import { quantityRules } from "@/pages/instances/create/CreateInstance.schema";

export const quantityDefaultValue = 1;

type TQuantityProps = {
  quota: number;
  type: string;
  region: string;
};

export const QuantitySelector = ({ quota, type, region }: TQuantityProps) => {
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
                min={quantityRules.min}
                max={quantityRules.max}
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
