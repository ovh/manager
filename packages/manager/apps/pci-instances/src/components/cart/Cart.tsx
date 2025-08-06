import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { GenericCart, TCartProduct } from './genericCart/GenericCart';
import { TInstanceCreationForm } from '@/pages/instances/create/CreateInstance.page';

export const Cart = () => {
  const { control } = useFormContext<TInstanceCreationForm>();
  const instanceName = useWatch({ control, name: 'name' });
  const { t } = useTranslation();

  const products: TCartProduct[] = useMemo(
    () => [
      {
        title: t('pci_instances_common_instance_title'),
        designation: instanceName,
        expanded: true,
      },
    ],
    [instanceName, t],
  );

  return <GenericCart products={products} />;
};
