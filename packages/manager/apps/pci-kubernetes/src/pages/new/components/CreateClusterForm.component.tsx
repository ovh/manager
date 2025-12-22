import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { useCreateClusterForm } from '../hooks/useCreateClusterForm/useCreateClusterForm.hook';
import { CreationCart } from './CreationCart.component';
import { NameSection } from './NameSection.component';

export const CreateClusterForm = () => {
  const { t } = useTranslation('add');

  const form = useCreateClusterForm();

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6 md:flex-row">
        <section className="flex-[2]">
          <Text preset="heading-2" className="mb-6">
            {t('kubernetes_add')}
          </Text>
          <NameSection />
          <Divider spacing="64" />
        </section>
        <aside className="flex-1">
          <CreationCart />
        </aside>
      </div>
    </FormProvider>
  );
};
