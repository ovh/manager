import { TabsPanel, usePciUrl, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  ChangelogButton,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsLink,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import { CHANGELOG_LINKS, CHECK_PRICES_DOC_LINK } from '@/constants';
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
    const pciUrl = usePciUrl();


  
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
          headerButton: (
            <div className="flex items-center gap-x-3">
              <ChangelogButton links={CHANGELOG_LINKS} />
              <GuideMenu />
            </div>
          ),
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
              <OdsMessage color="information" isDismissible className='my-4 bg-gray-200'>
                <div className="flex flex-col gap-2">
                  <OdsText preset="span" className="font-bold">
                    {t(
                      'pci_projects_project_storages_cold_archive_banner_title',
                    )}
                  </OdsText>
                  <OdsText preset="span">
                    {t(
                      'pci_projects_project_storages_cold_archive_banner_description',
                    )}{' '}
                    {t(
                      'pci_projects_project_storages_cold_archive_banner_feature_intro',
                    )}
                  </OdsText>
                  <ul className="list-disc ">
                    <li>
                      <OdsText>
                      {t(
                        'pci_projects_project_storages_cold_archive_banner_feature_1',
                      )}
                      </OdsText>
                    </li>
                    <li>
                    <OdsText>
                      {t(
                        'pci_projects_project_storages_cold_archive_banner_feature_2',
                      )}
                      </OdsText>
                    </li>
                  </ul>
                  <OdsLink
                    label={t(
                      'pci_projects_project_storages_cold_archive_banner_cta',
                    )}
                    href={`${pciUrl}/storages/objects`}
                    icon="arrow-right"
                  />
                </div>
              </OdsMessage>
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
