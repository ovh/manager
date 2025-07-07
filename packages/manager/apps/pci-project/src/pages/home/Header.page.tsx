import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  // OdsSpinner,
  OdsText,
  OdsBadge,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  ChangelogButton,
  Title,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import Navigation from './Navigation.page';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';

export default function ProjectHeader() {
  const { t } = useTranslation(['common', 'home', 'settings']);

  const { data: project, isError } = useProject();

  const appHomeUrl = useProjectUrl('public-cloud') + urls.home;

  if (!project) return <NotFound />;
  if (isError) return <OdsText>{t('error')}</OdsText>;
  if (!project) return <OdsText>{t('project_not_found')}</OdsText>;

  const projectDescription = project?.description;

  const ROADMAP_CHANGELOG_LINKS = {
    changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
    roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  };

  return isError ? (
    <NotFound />
  ) : (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={appHomeUrl} label={projectDescription} />
        </OdsBreadcrumb>
      }
    >
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Title className="">{projectDescription}</Title>
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
