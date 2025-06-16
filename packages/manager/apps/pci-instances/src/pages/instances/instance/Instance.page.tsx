import { FC } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
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

const Instance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId, regionId } = useParams() as {
    instanceId: string;
    regionId: string;
  };

  const { data: instance, isLoading } = useRegionInstance(
    project.project_id,
    instanceId,
    regionId,
    {
      select: (dto) => getInstanceDetail(dto),
    },
  );

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
      </PageLayout>
    </InstanceWrapper>
  );
};

export default Instance;
