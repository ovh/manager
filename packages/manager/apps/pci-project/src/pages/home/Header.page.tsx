import { Outlet, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProject, TabsPanel } from '@ovh-ux/manager-pci-common';
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

import { urls } from '@/routes/routes.constant';

export default function ProjectHeader() {
  const { t } = useTranslation(['common', 'home', 'settings']);
  const appHomeUrl = useProjectUrl('public-cloud') + urls.home;
  const { data: project, isLoading, error } = useProject();
  const { pathname: homePath } = useResolvedPath(urls.home);
  const { pathname: settingsPath } = useResolvedPath(urls.edit);

  if (error) throw error;

  const projectDescription = project?.description;

  const ROADMAP_CHANGELOG_LINKS = {
    changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
    roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  };

  const title = (
    <div className="flex items-center gap-4">
      {isLoading ? (
        <OdsSkeleton className="w-48 h-6" />
      ) : (
        <Title>{projectDescription}</Title>
      )}
      {/* TODO: Add condition to display the badge */}
      <OdsBadge className="mb-7" label={t('common:discovery_mode')} />
    </div>
  );

  const tabs = [
    {
      name: 'home',
      title: t('home:name'),
      to: homePath,
    },
    {
      name: 'settings',
      title: t('settings:name'),
      to: settingsPath,
    },
  ];

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
      header={{
        title: projectDescription,
        // TODO: Add a title JSX element in MRC
        // title: title,
        changelogButton: <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />,
      }}
      tabs={
        <nav aria-label={t('common:main_navigation')}>
          <TabsPanel tabs={tabs} />
        </nav>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
