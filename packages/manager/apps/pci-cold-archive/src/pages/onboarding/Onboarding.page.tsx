import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  BaseLayout,
  Card,
  OnboardingLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  PciAnnouncementBanner,
  useProductRegionsAvailability,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { Suspense, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useArchives } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_TRACKING, ONBOARDING_DOC_LINKS } from '@/constants';

export default function OnBoardingPage() {
  const { t } = useTranslation(['onboarding', 'cold-archive']);
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const urlProject = useProjectUrl('public-cloud');
  const navigate = useNavigate();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { tracking } = useContext(ShellContext).shell;
  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const { data: allArchives, isPending: isArchivesPending } = useArchives(
    projectId,
    regions?.[0],
  );

  const guides = ONBOARDING_DOC_LINKS.reduce(
    (list, guide) => [
      ...list,
      {
        ...guide,
        title: t(
          `cold-archive:pci_projects_project_storages_cold_archives_guides_${guide.id}_title`,
        ),
        description: t(
          `cold-archive:pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
        ),
        link: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
      },
    ],
    [],
  );

  const tileItems = guides.map((guide) => ({
    id: guide.id,
    href: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
    texts: {
      category: t('onboarding:onboarding_guide_title'),
      description: t(
        `cold-archive:pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
      )
        ? t(
            `cold-archive:pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
          )
        : '',
      title: t(
        `cold-archive:pci_projects_project_storages_cold_archives_guides_${guide.id}_title`,
      ),
    },
  }));

  const isPending = isArchivesPending || isRegionsPending;

  return (
    <RedirectionGuard
      isLoading={isPending}
      route={`/pci/projects/${projectId}/storages/cold-archive`}
      condition={allArchives?.length > 0}
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem href={urlProject} label={project?.description} />
            <OdsBreadcrumbItem
              href=""
              label={t(
                'cold-archive:pci_projects_project_storages_cold_archive_label',
              )}
            />
          </OdsBreadcrumb>
        }
      >
        <PciAnnouncementBanner />
        <OnboardingLayout
          title={t(
            'cold-archive:pci_projects_project_storages_cold_archive_label',
          )}
          description={
            <div className="text-center">
              <OdsText className="mt-8 block">
                {t(
                  'pci_projects_project_storages_cold_archives_onboarding_content1',
                )}
              </OdsText>
              <OdsText className="mt-6 block">
                {t(
                  'pci_projects_project_storages_cold_archives_onboarding_content2',
                )}
              </OdsText>
            </div>
          }
          orderButtonLabel={t(
            'pci_projects_project_storages_cold_archives_onboarding_action_label',
          )}
          onOrderButtonClick={() => {
            navigate('../new');
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.ONBOARDING.MAIN}::${COLD_ARCHIVE_TRACKING.ONBOARDING.ADD_CONTAINER}`,
            });
          }}
        >
          {tileItems.map((tile) => (
            <Card key={tile.id} href={tile.href} texts={tile.texts} />
          ))}
        </OnboardingLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
