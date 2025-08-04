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
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';

import { ROADMAP_CHANGELOG_LINKS } from '@/constants';
import { PROJECT_TABS } from '@/constants/tabs.constant';

export default function ProjectHeader() {
  const { t } = useTranslation('project');

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project, isLoading, error } = useProject();

  const tabs = PROJECT_TABS.map((tab) => ({
    ...tab,
    title: t(tab.titleKey),
  }));

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
        title: project?.description,
        badge: isDiscovery
          ? {
              color: ODS_BADGE_COLOR.information,
              size: ODS_BADGE_SIZE.md,
              label: t('pci_projects_project_label_discovery'),
            }
          : undefined,
        changelogButton: <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />,
      }}
      tabs={
        <nav aria-label={t('pci_project_project_main_navigation')}>
          <TabsPanel tabs={tabs} />
        </nav>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
