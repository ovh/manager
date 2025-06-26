import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import {
  isDiscoveryProject,
  TabsPanel,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  ChangelogButton,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { useTabs } from '@/hooks/tabs/useTabs';
import { ROADMAP_CHANGELOG_LINKS } from '@/constants';

export default function ProjectHeader() {
  const { t } = useTranslation('project');

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project, isLoading, error } = useProject();
  const { tabs } = useTabs();
  const isDiscovery = isDiscoveryProject(project);

  if (error) throw error;

  return (
    <BaseLayout
      breadcrumb={
        isLoading ? (
          <OdsSkeleton className="w-48 h-6" />
        ) : (
          <OdsBreadcrumb>
            <OdsBreadcrumbItem
              href={hrefProject}
              label={project?.description}
            />
          </OdsBreadcrumb>
        )
      }
      header={{
        title: ((
          <div className="flex gap-4">
            <OdsText preset="heading-1">{project?.description}</OdsText>
            {isDiscovery && (
              <OdsBadge label={t('pci_projects_project_label_discovery')} />
            )}
          </div>
        ) as unknown) as string,
        changelogButton: <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />,
      }}
      tabs={<TabsPanel tabs={tabs} />}
    >
      <Outlet />
    </BaseLayout>
  );
}
