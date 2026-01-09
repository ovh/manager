import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { Spinner, Text } from '@ovhcloud/ods-react';
import CreateShareForm from '@/pages/create/components/form/CreateShareForm.component';

const CreateSharePage: FC = () => {
  const { t } = useTranslation(['create']);

  const { isLoading } = useShareCatalog();

  return (
    <main>
      <Breadcrumb items={[{ label: t('title') }]} />
      <section className="p-6">
      </section>
      <section>
        <article className="mb-9">
          <Text preset="heading-1">
            {t('common:pci_instances_common_create_instance')}
          </Text>
        </article>
      </section>
      <section>
        {isLoading ? <Spinner /> : <CreateShareForm/>}
      </section>
    </main>
  );
};

export default CreateSharePage;
