import {
  ChangelogButton,
  PageLayout,
  PciGuidesHeader,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { FC, useMemo } from 'react';
import { Outlet, useResolvedPath, useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TProject, useParam } from '@ovh-ux/manager-pci-common';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { GoBack } from '@/components/navigation/GoBack.component';
import TabsPanel from '@/components/tab/TabsPanel.component';
import InstanceWrapper from './InstanceWrapper.page';
import { CHANGELOG_LINKS } from '@/constants';
import InstanceName from './dashboard/components/InstanceName.component';
import { useDashboard } from './dashboard/hooks/useDashboard';
import { LoadingCell } from '../datagrid/components/cell/LoadingCell.component';
import InstanceErrorGuard from './InstanceErrorGuard.page';
import { SearchNotifications } from '@/components/SearchNotifications/SearchNotifications';

const Instance: FC = () => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, 'dashboard']);
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId, region } = useParam('region', 'instanceId');
  const dashboardPath = useResolvedPath('');
  const vncPath = useResolvedPath(`../${instanceId}/vnc`); // vnc will be redirect to the legacy page until migration done

  const { instance, isPending: isInstanceLoading, error } = useDashboard({
    region,
    instanceId,
  });

  const tabs = useMemo(() => {
    const defaultTab = [
      {
        label: t('general_information'),
        to: dashboardPath.pathname,
      },
    ];

    return instance?.isEditEnabled
      ? [
          ...defaultTab,
          {
            label: t('dashboard:pci_instances_dashboard_tab_vnc_title'),
            to: vncPath.pathname,
          },
        ]
      : defaultTab;
  }, [dashboardPath.pathname, vncPath.pathname, t, instance?.isEditEnabled]);

  return (
    <InstanceWrapper>
      <InstanceErrorGuard error={error}>
        <PageLayout>
          <Breadcrumb
            projectLabel={project.description ?? ''}
            items={[{ label: instance?.name ?? '' }]}
          />
          <header className="header mt-8">
            <div className="flex items-center justify-between">
              <LoadingCell isLoading={isInstanceLoading}>
                {instance && <InstanceName instance={instance} />}
              </LoadingCell>
              <div className="flex gap-x-3">
                <ChangelogButton links={CHANGELOG_LINKS} />
                <PciGuidesHeader category="instances" />
              </div>
            </div>
          </header>
          <div className="mt-8 mb-8">
            <Notifications />
            <SearchNotifications />
          </div>
          <GoBack />
          <div className="mt-8">
            <TabsPanel tabs={tabs} />
          </div>
          <div className="mt-8">
            <Outlet />
          </div>
        </PageLayout>
      </InstanceErrorGuard>
    </InstanceWrapper>
  );
};
export default Instance;
