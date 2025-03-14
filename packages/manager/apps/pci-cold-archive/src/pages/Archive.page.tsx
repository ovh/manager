import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import { CHECK_PRICES_DOC_LINK } from '@/constants';
import GuideMenu from '@/components/GuideMenu.component';
import { useArchives } from '@/api/hooks/useArchive';
import { useTabs } from '@/hooks/useTabs';

export default function ColdArchivePage() {
  const { t } = useTranslation('cold-archive');

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const { tabs, isUserTabSelected } = useTabs();

  const { data: allArchives, isPending } = useArchives(project.project_id);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const priceLink =
    CHECK_PRICES_DOC_LINK[ovhSubsidiary] || CHECK_PRICES_DOC_LINK.DEFAULT;

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allArchives?.length === 0}
      route="./onboarding"
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem label={project.description} href={hrefProject} />
            <OdsBreadcrumbItem
              label={t('pci_projects_project_storages_cold_archive_label')}
              href={useHref(ROUTE_PATHS.STORAGES)}
            />
            {isUserTabSelected && (
              <OdsBreadcrumbItem
                label={t(
                  'pci_projects_project_storages_cold_archive_tabs_tab_users',
                )}
                href="#"
              />
            )}
          </OdsBreadcrumb>
        }
        header={{
          title: t('pci_projects_project_storages_cold_archive_label'),
          headerButton: <GuideMenu />,
        }}
        description={
          ((
            <>
              <OdsText preset="paragraph" className="mr-4">
                {t('pci_projects_project_storages_cold_archive_description')}
              </OdsText>
              <OdsLink
                label={t(
                  'pci_projects_project_storages_cold_archive_price_link',
                )}
                target="_blank"
                icon="external-link"
                href={priceLink}
              />
            </>
          ) as unknown) as string
        }
        tabs={<TabsPanel tabs={tabs} />}
      >
        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
