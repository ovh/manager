import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import { BaseLayout, useProjectUrl } from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTabs } from '@/hooks/useTabs';

export default function DashboardPage() {
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');

  const { tabs } = useTabs();

  return (
    <BaseLayout
      header={{ title: project?.description }}
      tabs={<TabsPanel tabs={tabs} />}
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
        </OdsBreadcrumb>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
