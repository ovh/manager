import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { NameSection } from '@/components/create/NameSection.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { useCreateClusterForm } from '../hooks/useCreateClusterForm/useCreateClusterForm';
import { CreationCart } from './CreationCart.component';

const dividerSpacing = '64';

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
          <NameSection<TCreateClusterSchema>
            fieldName="name"
            fieldHelper={t('kubernetes_add_cluster_name_input_pattern_validation_error')}
          />
          <Divider spacing={dividerSpacing} />
        </section>
        <aside className="flex-1">
          <CreationCart />
        </aside>
      </div>
    </FormProvider>
  );
};
