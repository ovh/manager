import { Trans, useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import {
  FormField,
  FormFieldLabel,
  Link,
  Quantity,
  QuantityControl,
  QuantityInput,
  Text,
} from '@ovhcloud/ods-react';
import { quantityRules } from '@/pages/instances/create/CreateInstance.schema';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { TInstanceCreationForm } from '../CreateInstance.page';

export const quantityDefaultValue = 1;

type TQuantityProps = {
  quota: number;
  type: string;
  region: string;
};

export const QuantitySelector = ({ quota, type, region }: TQuantityProps) => {
  const { t } = useTranslation('creation');
  const projectUrl = useProjectUrl('public-cloud');

  const {
    formState: {
      errors: { quantity: error },
    },
    control,
  } = useFormContext<TInstanceCreationForm>();
  const quantity = useWatch({
    control,
    name: 'quantity',
  });

  return (
    <article className="flex flex-col w-full mb-8">
      <Text preset="heading-2">
        {t('pci_instances_creation_quantity_title')}
      </Text>
      <div className="mt-4 pt-3 pb-4">
        <FormField>
          <FormFieldLabel>
            {t('pci_instances_creation_quantity_label')}
          </FormFieldLabel>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <Quantity
                min={quantityRules.min}
                max={quantityRules.max}
                invalid={!!error}
                onValueChange={({ value }) => field.onChange(Number(value))}
                value={String(quantity)}
                required
              >
                <QuantityControl>
                  <QuantityInput />
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
        <Trans
          t={t}
          i18nKey="pci_instance_creation_quantity_rule"
          shouldUnescape
          values={{ quota, type, region }}
          tOptions={{ interpolation: { escapeValue: true } }}
          components={{
            Link: (
              <Link
                className="visited:text-[var(--ods-color-primary-500)]"
                href={`${projectUrl}/quota`}
              />
            ),
          }}
        />
      </Text>
    </article>
  );
};
