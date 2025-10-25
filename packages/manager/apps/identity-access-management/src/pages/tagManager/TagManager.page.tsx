import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  ChangelogButton,
  HeadersProps,
  Notifications,
} from '@ovh-ux/manager-react-components';
import TagsListDatagrid from './components/tagsListDatagrid/TagsListDatagrid.component';
import { TagManagerContextProvider } from './TagManagerContext';
import { CHANGELOG_LINKS, CHANGELOG_CHAPTERS } from '@/constants';

export default function TagManager() {
  const { t } = useTranslation('tag-manager');

  const header: HeadersProps = {
    title: t('title'),
    description: t('description'),
    changelogButton: (
      <ChangelogButton links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />
    ),
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
