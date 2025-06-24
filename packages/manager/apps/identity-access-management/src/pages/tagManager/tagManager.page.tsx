import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseLayout } from '@ovh-ux/manager-react-components';

export default function TagManager() {
  const { t } = useTranslation('tag-manager');

  const header = {
    title: t('title'),
  };

  return (
    <BaseLayout header={header}>
      <React.Suspense></React.Suspense>
    </BaseLayout>
  );
}
