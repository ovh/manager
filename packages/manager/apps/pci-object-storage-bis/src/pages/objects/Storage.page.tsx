import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  ChangelogButton,
  PciGuidesHeader,
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
import { CHANGELOG_LINKS } from '@/constants';

export default function ObjectsPage() {
  const { t } = useTranslation('objects');
  const location = useLocation();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

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
  }, [location.pathname, t]);

  return (
    <>
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem label={project.description} href={hrefProject} />
            <OdsBreadcrumbItem label={activePanelTranslation} href="#" />
          </OdsBreadcrumb>
        }
        header={{
          title: t('pci_projects_project_storages_containers_object_title'),
          description: t(
            'pci_projects_project_storages_containers_object_description',
          ),
          headerButton: <PciGuidesHeader category="objectStorage" />,
          changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        }}
        tabs={<TabsPanel tabs={tabs} />}
      >
        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </>
  );
}
