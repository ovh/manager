import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import {
  isDiscoveryProject,
  TabsPanel,
  useProject,
  usePciUrl,
} from '@ovh-ux/manager-pci-common';
import { BaseLayout, ChangelogButton } from '@ovh-ux/manager-react-components';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';

import { ROADMAP_CHANGELOG_LINKS } from '@/constants';
import { useProjectTabs } from '@/hooks/useProjectTabs';
import QuotaAlert from './components/QuotaAlert.component';
import PciAnnouncementBanner from './components/PciAnnouncementBanner.component';
import { ProjectValidationGuard } from '@/components/project-validation-guard/ProjectValidationGuard';

export default function ProjectHeader() {
  const { t } = useTranslation(['home', NAMESPACES.FORM]);

  const hrefProject = usePciUrl();
  const { data: project, isLoading } = useProject();
  const tabs = useProjectTabs();

  const isDiscovery = isDiscoveryProject(project);

  return (
    <ProjectValidationGuard>
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
                label: t('pci_projects_home_label_discovery'),
              }
            : undefined,
          changelogButton: <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />,
        }}
        tabs={
          <nav aria-label={t('pci_projects_home_main_navigation')}>
            <TabsPanel tabs={tabs} />
          </nav>
        }
      >
        <QuotaAlert />
        <PciAnnouncementBanner />
        <Outlet />
      </BaseLayout>
    </ProjectValidationGuard>
  );
}
