import { useRouteLoaderData } from 'react-router-dom';
import {
  ChangelogButton,
  PageLayout,
  PciGuidesHeader,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { TProject } from '@ovh-ux/manager-pci-common';
import { FC } from 'react';
import { GoBack } from '@/components/navigation/GoBack.component';
import InstanceWrapper from './InstanceWrapper.page';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/constants';

const Instance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;

  return (
    <InstanceWrapper>
      <PageLayout>
        {project && (
          <Breadcrumb
            projectLabel={project.description ?? ''}
            items={[{ label: 'instance-region-name' }]}
          />
        )}
        <div className="header mb-6 mt-8">
          <div className="flex items-center justify-between">
            <Subtitle>{'instance-region-name'}</Subtitle>
            <div className="flex gap-x-3">
              <ChangelogButton links={CHANGELOG_LINKS} />
              <PciGuidesHeader category="instances" />
            </div>
          </div>
        </div>
        <GoBack />
      </PageLayout>
    </InstanceWrapper>
  );
};

export default Instance;
