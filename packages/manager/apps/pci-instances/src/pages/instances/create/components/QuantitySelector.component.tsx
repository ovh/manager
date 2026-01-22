import { Trans, useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
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
import {
  calculateQuantityValue,
  normalizeQuantity,
} from '@/pages/instances/create/utils/quantityUtils';
import { ControllerRenderProps, UseFormSetValue } from 'react-hook-form';

type TQuantityProps = {
  quota: number;
  type: string;
  region: string;
};

type TCreateQuantityHandlersParams = {
  quota: number;
  quantity: number;
  min: number;
  field: ControllerRenderProps<TInstanceCreationForm, 'quantity'>;
  setValue: UseFormSetValue<TInstanceCreationForm>;
};

export const createQuantityHandlers = ({
  quota,
  quantity,
  min,
  field,
  setValue,
}: TCreateQuantityHandlersParams) => {
  const handleValueChange = ({ valueAsNumber }: { valueAsNumber: number }) => {
    const calculatedValue = calculateQuantityValue(quota, valueAsNumber);
    if (!Number.isNaN(calculatedValue)) {
      field.onChange(calculatedValue);
    }
  };

  const handleBlur = () => {
    const normalizedValue = normalizeQuantity(quota, quantity, min);
    if (normalizedValue !== quantity) {
      setValue('quantity', normalizedValue, { shouldValidate: true });
    }
    field.onBlur();
  };

  return { handleValueChange, handleBlur };
};

export const QuantitySelector = ({ quota, type, region }: TQuantityProps) => {
  const { t } = useTranslation('creation');
  const projectUrl = useProjectUrl('public-cloud');

  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const quantity = useWatch({
    control,
    name: 'quantity',
  });

  const isDisabled = quota === 0;
  const normalizedQuantity = normalizeQuantity(
    quota,
    quantity,
    quantityDefaultValue,
  );

  useEffect(() => {
    if (normalizedQuantity !== quantity) {
      setValue('quantity', normalizedQuantity, { shouldValidate: true });
    }
  }, [normalizedQuantity, quantity, setValue]);

  return (
    <article className="mb-8 flex w-full flex-col">
      <div className="mt-4 pb-4 pt-3">
        <FormField>
          <FormFieldLabel>
            {t('pci_instances_creation_quantity_label')}
          </FormFieldLabel>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => {
              const { handleValueChange, handleBlur } = createQuantityHandlers({
                quota,
                quantity,
                min: quantityDefaultValue,
                field,
                setValue,
              });

              return (
                <Quantity
                  min={quantityDefaultValue}
                  max={quota}
                  disabled={isDisabled}
                  onValueChange={handleValueChange}
                  onBlur={handleBlur}
                  value={String(normalizedQuantity)}
                  required
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
      <Text preset="span">
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
