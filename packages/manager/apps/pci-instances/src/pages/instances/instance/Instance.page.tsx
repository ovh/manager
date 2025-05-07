import { FC } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
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
import InstanceName from './edit/InstanceName.component';

const Instance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId } = useParams();

  const { data: instance, isLoading } = useInstance(instanceId ?? '', {});

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
              <InstanceName instance={instance} isLoading={isLoading} />
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
