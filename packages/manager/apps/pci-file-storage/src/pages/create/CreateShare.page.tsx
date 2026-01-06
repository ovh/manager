import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';

const CreateSharePage: FC = () => {
  const { t } = useTranslation(['create']);

  return (
    <main>
      <Breadcrumb items={[{ label: t('title') }]} />
      <section>Formulaire</section>
    </main>
  );
};

export default CreateSharePage;
