import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  PciGuidesHeader,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useHref,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { ROUTE_PATHS } from '@/routes';
import { useArchives } from '@/api/hooks/useArchive';

export default function ColdArchivePage() {
  const { t } = useTranslation('cold-archive');

  const location = useLocation();
  const showUsersTab = location.pathname.includes('users');

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const { data: allArchives, isPending } = useArchives(project.project_id);

  const tabs = [
    {
      name: 'pci_projects_project_storages_cold_archive_label',
      title: t('pci_projects_project_storages_cold_archive_label'),
      to: useResolvedPath(ROUTE_PATHS.STORAGES).pathname,
    },
    {
      name: 'pci_projects_project_storages_cold_archive_tabs_tab_users',
      title: t('pci_projects_project_storages_cold_archive_tabs_tab_users'),
      to: useResolvedPath(ROUTE_PATHS.USER_LIST).pathname,
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allArchives?.length === 0}
      route="./onboarding"
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem label={project.description} href={hrefProject} />
            <OdsBreadcrumbItem
              label={t('pci_projects_project_storages_cold_archive_label')}
              href={useHref(ROUTE_PATHS.STORAGES)}
            />
            {showUsersTab && (
              <OdsBreadcrumbItem
                label={t(
                  'pci_projects_project_storages_cold_archive_tabs_tab_users',
                )}
                href="#"
              />
            )}
          </OdsBreadcrumb>
        }
        header={{
          title: t('pci_projects_project_storages_cold_archive_label'),
          description: t(
            'pci_projects_project_storages_cold_archive_description',
          ),
          // @TODO add link to consult price
          // @TODO Use correct guide  from cold archive
          headerButton: <PciGuidesHeader category="objectStorage" />,
        }}
        tabs={<TabsPanel tabs={tabs} />}
      >
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
