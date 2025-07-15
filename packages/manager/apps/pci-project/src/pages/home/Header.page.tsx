import { useTranslation } from 'react-i18next';
import { Outlet, useResolvedPath } from 'react-router-dom';

import {
  isDiscoveryProject,
  TabsPanel,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  ChangelogButton,
  useProjectUrl,
  Title,
} from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';

import { ROADMAP_CHANGELOG_LINKS } from '@/constants';
import { urls } from '@/routes/routes.constant';

export default function ProjectHeader() {
  const { t } = useTranslation('project');

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project, isLoading, error } = useProject();
  const { pathname: homePath } = useResolvedPath(urls.home);
  const { pathname: settingsPath } = useResolvedPath(urls.edit);
  const isDiscovery = isDiscoveryProject(project);

  const projectDescription = project?.description;

  const title = ( // Will be used when MRC is ready
    <div className="flex items-center gap-4">
      {isLoading ? (
        <OdsSkeleton className="w-48 h-6" />
      ) : (
        <Title>{projectDescription}</Title>
      )}
      {isDiscovery && (
        <OdsBadge className="mb-7" label={t('common:discovery_mode')} />
      )}
    </div>
  );

  const titleProvisory = projectDescription; // TODO: remove this line when MRC is ready

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

  if (error) throw error;

  return (
    <BaseLayout
      breadcrumb={
        isLoading ? (
          <OdsSkeleton className="w-48 h-6" />
        ) : (
          <OdsBreadcrumb>
            <OdsBreadcrumbItem href={hrefProject} label={projectDescription} />
          </OdsBreadcrumb>
        )
      }
      header={{
        title: titleProvisory, // TODO: replace with "title" when MRC is ready
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
