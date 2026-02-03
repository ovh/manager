import { Trans, useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  FormField,
  FormFieldLabel,
  Link,
  Quantity,
  QuantityControl,
  QuantityInput,
  Text,
} from '@ovhcloud/ods-react';
import {
  quantityDefaultValue,
  TInstanceCreationForm,
} from '@/pages/instances/create/CreateInstance.schema';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { calculateQuantityValue } from '@/pages/instances/create/utils/quantityUtils';
import { ControllerRenderProps } from 'react-hook-form';
import clsx from 'clsx';

type TQuantityProps = {
  quota: number;
  type: string;
  region: string;
};

type TCreateQuantityHandlersParams = {
  quota: number;
  quantity: number;
  field: ControllerRenderProps<TInstanceCreationForm, 'quantity'>;
};

export const createQuantityHandlers = ({
  quota,
  field,
}: TCreateQuantityHandlersParams) => {
  const handleValueChange = ({ valueAsNumber }: { valueAsNumber: number }) => {
    const calculatedValue = calculateQuantityValue(quota, valueAsNumber);
    if (!Number.isNaN(calculatedValue)) {
      field.onChange(calculatedValue);
    }
  };

  return { handleValueChange };
};

export const QuantitySelector = ({ quota, type, region }: TQuantityProps) => {
  const { t } = useTranslation('creation');
  const projectUrl = useProjectUrl('public-cloud');

  const { control } = useFormContext<TInstanceCreationForm>();
  const quantity = useWatch({
    control,
    name: 'quantity',
  });

  const isDisabled = quota === 0;

  return (
    <article className="flex w-full flex-col">
      <div className="mt-4 pb-4 pt-3">
        <FormField>
          <FormFieldLabel>
            {t('pci_instances_creation_quantity_label')}
          </FormFieldLabel>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => {
              const { handleValueChange } = createQuantityHandlers({
                quota,
                quantity,
                field,
              });

              return (
                <Quantity
                  min={quantityDefaultValue}
                  max={quota}
                  disabled={isDisabled}
                  onValueChange={handleValueChange}
                  value={String(quantity)}
                  required
                  invalid={quantity > quota}
                >
                  <QuantityControl>
                    <QuantityInput />
                  </QuantityControl>
                </Quantity>
              );
            }}
          />
        </FormField>
      </div>
      <Text
        className={clsx('text-sm', {
          'text-[--ods-color-critical-500]': quantity > quota,
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
                target="_blank"
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
