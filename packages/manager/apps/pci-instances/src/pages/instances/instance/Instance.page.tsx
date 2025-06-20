import { createContext, FC, useMemo } from 'react';
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
import { useRegionInstance } from '@/data/hooks/instance/useInstance';
import InstanceName from './component/InstanceName.component';
import { getInstanceDetail } from '@/data/hooks/instance/selectors/instances.selector';
import TabsPanel from '@/components/tab/TabsPanel.component';
import { TInstanceDetailContextType } from '@/types/instance/entity.type';
import { placeholderInstanceDetail } from './instance.constants';

export const InstanceDetailContext = createContext<TInstanceDetailContextType>({
  data: placeholderInstanceDetail,
  isLoading: false,
});

const Instance: FC = () => {
  const { t } = useTranslation('dashboard');
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId, regionId } = useParams() as {
    instanceId: string;
    regionId: string;
  };
  const dashboardPath = useResolvedPath('');
  const vncPath = useResolvedPath(`../${instanceId}/vnc`);

  const { data: instance, isLoading } = useRegionInstance(
    project.project_id,
    instanceId,
    regionId,
    {
      select: (dto) => getInstanceDetail(dto),
    },
  );

  const tabs = useMemo(() => {
    const defaultTab = [
      {
        label: t('pci_instances_dashboard_tab_info_title'),
        to: dashboardPath.pathname,
      },
    ];

    return instance?.isEditionEnabled
      ? [
          ...defaultTab,
          {
            label: t('pci_instances_dashboard_tab_vnc_title'),
            to: vncPath.pathname,
          },
        ]
      : defaultTab;
  }, [dashboardPath.pathname, vncPath.pathname, t, instance?.isEditionEnabled]);

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
              {instance && (
                <InstanceName
                  instanceId={instance.id}
                  isEditable={instance.isEditionEnabled}
                  name={instance.name}
                  region={regionId}
                />
              )}
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
          <InstanceDetailContext.Provider
            value={{ data: instance ?? placeholderInstanceDetail, isLoading }}
          >
            <Outlet />
          </InstanceDetailContext.Provider>
        </div>
      </PageLayout>
    </InstanceWrapper>
  );
};

export default Instance;
