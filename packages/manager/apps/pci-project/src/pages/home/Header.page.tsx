import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProject } from '@ovh-ux/manager-pci-common';
import {
  OdsBadge,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  ChangelogButton,
  Title,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import Navigation from './Navigation.component';
import { urls } from '@/routes/routes.constant';

export default function ProjectHeader() {
  const { t } = useTranslation(['common', 'home', 'settings']);
  const appHomeUrl = useProjectUrl('public-cloud') + urls.home;
  const { data: project, isLoading, error } = useProject();

  if (error) throw error;

  const projectDescription = project?.description;

  const ROADMAP_CHANGELOG_LINKS = {
    changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
    roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  };

  return (
    <BaseLayout
      breadcrumb={
        isLoading ? (
          <OdsSkeleton className="w-48 h-6" />
        ) : (
          <OdsBreadcrumb>
            <OdsBreadcrumbItem href={appHomeUrl} label={projectDescription} />
          </OdsBreadcrumb>
        )
      }
    >
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <OdsSkeleton className="w-48 h-6" />
          ) : (
            <Title>{projectDescription}</Title>
          )}
          <OdsBadge className="mb-7" label={t('common:discovery_mode')} />
        </div>
        <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />
      </header>

      <Navigation />

      <main className="mt-9">
        <Outlet />
      </main>
    </BaseLayout>
  );
}
