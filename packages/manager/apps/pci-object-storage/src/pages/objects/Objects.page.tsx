import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  Notifications,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { Suspense, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useResolvedPath } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import TabsPanel from '@/components/TabsPanel.component';

export default function BillingPage() {
  const { t } = useTranslation('objects');
  const location = useLocation();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const tabs = [
    {
      name: 'pci_projects_project_storages_containers_my_containers_label',
      title: t('pci_projects_project_storages_containers_my_containers_label'),
      to: useResolvedPath(ROUTE_PATHS.OBJECTS).pathname,
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
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          { label: activePanelTranslation },
        ]}
      />

      <div className="flex items-center justify-between mt-8">
        <Headers
          title={t('pci_projects_project_storages_containers_object_title')}
        />
        <PciGuidesHeader category="objectStorage" />
      </div>
      <Headers
        description={t(
          'pci_projects_project_storages_containers_object_description',
        )}
      />
      <Notifications />

      <div className="my-10 mt-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
