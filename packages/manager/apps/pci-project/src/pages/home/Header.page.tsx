import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBreadcrumb, OdsBreadcrumbItem, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  PciAnnouncementBanner,
  TabsPanel,
  isDiscoveryProject,
  usePciUrl,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { BaseLayout, ChangelogButton } from '@ovh-ux/manager-react-components';

import { ProjectValidationGuard } from '@/components/project-validation-guard/ProjectValidationGuard';
import { CHANGELOG_LINKS } from '@/constants';
import { useProjectTabs } from '@/hooks/useProjectTabs';
import { TProject } from '@/types/pci-common.types';

import PublicCloudPricingBanner from './components/PublicCloudPricingBanner.component';
import QuotaAlert from './components/QuotaAlert.component';

export default function ProjectHeader() {
  const { t } = useTranslation([
    'home',
    'edit',
    'hds',
    'activate',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);

  const hrefProject = (usePciUrl as unknown as () => string)();
  const { data: project, isLoading } = (
    useProject as unknown as () => {
      data: TProject | undefined;
      isLoading: boolean;
    }
  )();
  const tabs = useProjectTabs();

  const isDiscovery = (isDiscoveryProject as (p: TProject | undefined) => boolean)(project);

  return (
    <ProjectValidationGuard>
      <BaseLayout
        breadcrumb={
          isLoading ? (
            <OdsSkeleton className="h-6 w-48" />
          ) : (
            <OdsBreadcrumb>
              <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
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
          changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        }}
        tabs={
          <nav aria-label={t('pci_projects_home_main_navigation')}>
            <TabsPanel tabs={tabs} />
          </nav>
        }
      >
        <QuotaAlert />
        <PublicCloudPricingBanner />
        <PciAnnouncementBanner projectId={project?.project_id} />

        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </ProjectValidationGuard>
  );
}
