import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { GenericCart, TCartProduct } from './genericCart/GenericCart';
import { TInstanceCreationForm } from '@/pages/instances/create/CreateInstance.page';
import { TInstance } from '@/types/instance/entity.type';
import { quantityDefaultValue } from "@/pages/instances/create/components/QuantitySelector.component";

export const Cart = () => {
  const { control } = useFormContext<TInstanceCreationForm>();
  const instance: Partial<TInstance> = {
    name: useWatch({ control, name: 'name' }),
    quantity: useWatch({
      control,
      name: 'quantity',
      defaultValue: quantityDefaultValue,
    }),
  };
  const { t } = useTranslation();

  const products: TCartProduct[] = useMemo(
    () => [
      {
        title: t('pci_instances_common_instance_title'),
        designation: instance.name,
        quantity: instance.quantity,
        expanded: true,
      },
    ],
    [instance.name, instance.quantity, t],
  );

  return <GenericCart products={products} />;
};
