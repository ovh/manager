import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  PciGuidesHeader,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { Suspense, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useResolvedPath } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import { useAllStorages } from '@/api/hooks/useStorages';

export default function ObjectsPage() {
  const { t } = useTranslation('objects');
  const location = useLocation();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const { data: allStorages, isPending } = useAllStorages(project.project_id);

  const tabs = [
    {
      name: 'pci_projects_project_storages_containers_my_containers_label',
      title: t('pci_projects_project_storages_containers_my_containers_label'),
      to: useResolvedPath(ROUTE_PATHS.STORAGES).pathname,
    },
    {
      name: 'pci_projects_project_storages_containers_s3_users_label',
      title: t('pci_projects_project_storages_containers_s3_users_label'),
      to: useResolvedPath(ROUTE_PATHS.USER_LIST).pathname,
    },
  ];

  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname === tab.to);
    setActivePanelTranslation(t(activeTab?.name));
  }, [location.pathname]);

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allStorages?.resources.length === 0}
      route="./onboarding"
    >
      <OdsBreadcrumb className="mb-8">
        <OdsBreadcrumbItem label={project.description} href={hrefProject} />
        <OdsBreadcrumbItem label={activePanelTranslation} href="#" />
      </OdsBreadcrumb>

      <Headers
        title={t('pci_projects_project_storages_containers_object_title')}
        description={t(
          'pci_projects_project_storages_containers_object_description',
        )}
        headerButton={<PciGuidesHeader category="objectStorage" />}
      />

      <div className="mt-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
