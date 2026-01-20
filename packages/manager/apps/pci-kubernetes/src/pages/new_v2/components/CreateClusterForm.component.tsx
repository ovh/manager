import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { useCreateClusterForm } from '../hooks/useCreateClusterForm/useCreateClusterForm';
import { ClusterLocationSection } from './ClusterLocationSection.component';
import { ClusterNameSection } from './ClusterNameSection.component';
import { CreationCart } from './CreationCart.component';

const dividerSpacing = '64';

const MOCK_is3azAvailable = true;

export const CreateClusterForm = () => {
  const { t } = useTranslation('add');

  const form = useCreateClusterForm(MOCK_is3azAvailable);

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6 md:flex-row">
        <section className="flex-[2]">
          <Text preset="heading-2" className="mb-6">
            {t('kubernetes_add')}
          </Text>
          <ClusterNameSection />
          <Divider spacing={dividerSpacing} />
          <ClusterLocationSection is3azAvailable={MOCK_is3azAvailable} />
          <Divider spacing={dividerSpacing} />
        </section>
        <aside className="flex-1">
          <CreationCart />
        </aside>
      </div>
    </FormProvider>
  );
};
