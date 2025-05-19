import { FC } from 'react';
import {
  Outlet,
  useParams,
  useResolvedPath,
  useRouteLoaderData,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import {
  ChangelogButton,
  PageLayout,
  PciGuidesHeader,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { TProject } from '@ovh-ux/manager-pci-common';
import { GoBack } from '@/components/navigation/GoBack.component';
import InstanceWrapper from './InstanceWrapper.page';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/constants';
import { useInstance } from '@/data/hooks/instance/useInstance';
import InstanceName from './component/InstanceName.component';
import TabsPanel from '@/components/tab/TabsPanel.component';

const Instance: FC = () => {
  const { t } = useTranslation('dashboard');
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId } = useParams() as { instanceId: string };

  const { data: instance, isLoading } = useInstance(instanceId, {});

  const dashboardPath = useResolvedPath('');
  const vncPath = useResolvedPath('vnc');

  const tabs = [
    {
      label: t('pci_instances_dashboard_tab_info_title'),
      to: dashboardPath.pathname,
    },
    {
      label: t('pci_instances_dashboard_tab_vnc_title'),
      to: vncPath.pathname,
    },
  ];

  return (
    <InstanceWrapper>
      <PageLayout>
        {project && (
          <Breadcrumb
            projectLabel={project.description ?? ''}
            items={[{ label: instance?.name ?? '' }]}
          />
        )}
        <div className="header mt-8">
          <div className="flex items-center justify-between">
            <div className="flex-[0.8]">
              {isLoading && <OsdsSkeleton size={ODS_SKELETON_SIZE.sm} inline />}
              {instance && <InstanceName instance={instance} />}
            </div>
            <div className="flex gap-x-3">
              <ChangelogButton links={CHANGELOG_LINKS} />
              <PciGuidesHeader category="instances" />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Notifications />
        </div>
        <GoBack />
        <div className="mt-8">
          <TabsPanel tabs={tabs} />
        </div>
        <div className="mt-8">
          <Outlet />
        </div>
      </PageLayout>
    </InstanceWrapper>
  );
};

export default Instance;
