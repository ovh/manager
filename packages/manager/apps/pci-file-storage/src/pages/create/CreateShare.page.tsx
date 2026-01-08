import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { Spinner } from '@ovhcloud/ods-react';

const CreateSharePage: FC = () => {
  const { t } = useTranslation(['create']);

  const { isLoading } = useShareCatalog();

  return (
    <main>
      <Breadcrumb items={[{ label: t('title') }]} />
      <section className="p-6">
      </section>
      <section>
        {isLoading ? <Spinner /> : <div>Form</div>}
      </section>
    </main>
  );
};

export default CreateSharePage;
