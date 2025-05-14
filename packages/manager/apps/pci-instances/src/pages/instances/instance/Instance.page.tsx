import { TProject } from '@ovh-ux/manager-pci-common';
import {
  ChangelogButton,
  Notifications,
  PageLayout,
  PciGuidesHeader,
} from '@ovh-ux/manager-react-components';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { GoBack } from '@/components/navigation/GoBack.component';
import { CHANGELOG_LINKS } from '@/constants';
import { useInstancesPolling } from '@/data/hooks/instance/polling/useInstancesPolling';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { StatusCell } from '../datagrid/cell/StatusCell.component';
import InstanceWrapper from './InstanceWrapper.page';
import InstanceName from './component/InstanceName.component';

const Instance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId } = useParams() as { instanceId: string };
  const { data: instance, isLoading } = useInstance(instanceId, {});

  const pendingTaskIds = instance?.pendingTask ? [instanceId] : [];

  const polling = useInstancesPolling(pendingTaskIds);

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
              <div className="flex flex-row gap-x-4 items-center">
                {instance && <InstanceName instance={instance} />}
                {instance && (
                  <StatusCell
                    instance={instance}
                    isLoading={isLoading}
                    isPolling={polling?.length > 0}
                  />
                )}
              </div>
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
      </PageLayout>
    </InstanceWrapper>
  );
};

export default Instance;
