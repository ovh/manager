import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  HeadersProps,
  Notifications,
} from '@ovh-ux/manager-react-components';
import TagsListDatagrid from './components/tagsListDatagrid/tagsListDatagrid.component';
import { TagManagerContextProvider } from './tagsManagerContext';

export default function TagManager() {
  const { t } = useTranslation('tag-manager');

  const header: HeadersProps = {
    title: t('title'),
    description: t('description'),
  };

  return (
    <BaseLayout header={header} message={<Notifications />}>
      <React.Suspense>
        <TagManagerContextProvider>
          <TagsListDatagrid></TagsListDatagrid>
        </TagManagerContextProvider>
      </React.Suspense>
    </BaseLayout>
  );
}
