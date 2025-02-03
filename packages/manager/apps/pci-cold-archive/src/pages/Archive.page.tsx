import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  PciGuidesHeader,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Suspense, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useResolvedPath } from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { ROUTE_PATHS } from '@/routes';

export default function ColdArchivePage() {
  const { t } = useTranslation('cold-archive');

  const location = useLocation();
  const hrefProject = useProjectUrl('public-cloud');

  const { data: project } = useProject();

  const tabs = [
    {
      name: 'pci_projects_project_storages_cold_archive_tabs_tab_archives',
      title: t('pci_projects_project_storages_cold_archive_tabs_tab_archives'),
      to: useResolvedPath(ROUTE_PATHS.CONTAINER_LISTING).pathname,
    },
    {
      name: 'pci_projects_project_storages_cold_archive_tabs_tab_users',
      title: t('pci_projects_project_storages_cold_archive_tabs_tab_users'),
      to: useResolvedPath(ROUTE_PATHS.USERS_LISTING).pathname,
    },
  ];

  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname === tab.to);
    setActivePanelTranslation(t(activeTab?.name));
  }, [location.pathname]);

  return (
    <RedirectionGuard isLoading={false} condition={false} route="./onboarding">
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem label={project.description} href={hrefProject} />
            <OdsBreadcrumbItem label={activePanelTranslation} href="#" />
          </OdsBreadcrumb>
        }
        header={{
          title: t('pci_projects_project_storages_cold_archive_label'),
          description: t(
            'pci_projects_project_storages_cold_archive_description',
          ),
          headerButton: <PciGuidesHeader category="storage" />,
        }}
        tabs={<TabsPanel tabs={tabs} />}
      >
        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
