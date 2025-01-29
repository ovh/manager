import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  PciGuidesHeader,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Suspense, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useResolvedPath } from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ROUTE_PATHS } from '@/routes';
import { useArchive } from '@/api/hooks/useArchive';
import { useProductRegionsAvailability } from '@/api/hooks/useProductRegionsAvailability';

export default function ObjectsPage() {
  const { t } = useTranslation('cold-archive');
  const location = useLocation();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(ovhSubsidiary);
  const { data: allArchives, isPending: isPendingArchive } = useArchive(
    project.project_id,
    regions ? regions[0] : '',
  );

  const tabs = [
    {
      name: 'pci_projects_project_storages_cold_archive_tabs_tab_archives',
      title: t('pci_projects_project_storages_cold_archive_tabs_tab_archives'),
      to: useResolvedPath(ROUTE_PATHS.STORAGES).pathname,
    },
    {
      name: 'pci_projects_project_storages_cold_archive_tabs_tab_users',
      title: t('pci_projects_project_storages_cold_archive_tabs_tab_users'),
      to: useResolvedPath(ROUTE_PATHS.USER_LIST).pathname,
    },
  ];

  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname === tab.to);
    setActivePanelTranslation(t(activeTab?.name));
  }, [location.pathname]);

  const isPending = isPendingArchive || isRegionsPending;

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
            <OdsBreadcrumbItem label={activePanelTranslation} href="#" />
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
        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
