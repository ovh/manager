import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Outlet,
  useParams,
  useResolvedPath,
  useRouteLoaderData,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const dashboardPath = useResolvedPath('');
  const vncPath = useResolvedPath('vnc');
  const [dedicatedUrl, setDedicatedUrl] = useState('');

  const { data: instance, isLoading } = useRegionInstance(
    project.project_id,
    instanceId,
    regionId,
    {
      select: (dto) => getInstanceDetail(dto, dedicatedUrl, project.project_id),
    },
  );

  const tabs = useMemo(
    () => [
      {
        label: t('pci_instances_dashboard_tab_info_title'),
        to: dashboardPath.pathname,
      },
      {
        label: t('pci_instances_dashboard_tab_vnc_title'),
        to: vncPath.pathname,
      },
    ],
    [],
  );

  // TODO: verify if there is a best way to build this external url
  useEffect(() => {
    navigation
      .getURL('dedicated', '#/configuration/ip', {})
      .then((data) => setDedicatedUrl(data as string));
  }, [navigation]);

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
        <div className="mt-8 mb-8">
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
