import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  BaseLayout,
  Card,
  OnboardingLayout,
  RedirectionGuard,
  useFeatureAvailability,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { Suspense, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  AVAILABILITY,
  GUIDES,
  STANDARD_S3,
  TRACKING_PREFIX,
} from '@/constants';
import { useAllStorages } from '@/api/hooks/useStorages';

export default function OnBoardingPage() {
  const { i18n, t } = useTranslation(['onboarding']);
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const urlProject = useProjectUrl('public-cloud');
  const navigate = useNavigate();

  const { data: allStorages, isPending: isStoragesPending } = useAllStorages(
    projectId,
  );

  const {
    data: availability,
    isPending: isAvailabilityPending,
  } = useFeatureAvailability([AVAILABILITY.STANDARD_S3]);

  const isS3User = availability?.[AVAILABILITY.STANDARD_S3];
  const guides = isS3User ? STANDARD_S3 : GUIDES;

  const context = useContext(ShellContext);
  const { tracking } = context.shell;
  const { ovhSubsidiary } = context.environment.getUser();

  const tileItems = guides.map((guide) => ({
    id: guide.id,
    href: guide.link[ovhSubsidiary] || guide.link.DEFAULT,
    texts: {
      category: t('onboarding_guide_title'),
      description: i18n.exists(
        `onboarding:pci_projects_project_storages_objects_onboarding_guides_${guide.id}_description`,
      )
        ? t(
            `pci_projects_project_storages_objects_onboarding_guides_${guide.id}_description`,
          )
        : '',
      title: t(
        `pci_projects_project_storages_objects_onboarding_guides_${guide.id}_title`,
      ),
    },
  }));

  const isPending = isAvailabilityPending || isStoragesPending;

  return (
    <RedirectionGuard
      isLoading={isPending}
      route={`/pci/projects/${projectId}/storages/objects`}
      condition={allStorages?.resources.length > 0}
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem href={urlProject} label={project?.description} />
            <OdsBreadcrumbItem
              href=""
              label={t(
                'pci_projects_project_storages_objects_onboarding_title',
              )}
            />
          </OdsBreadcrumb>
        }
      >
        <OnboardingLayout
          title={t('pci_projects_project_storages_objects_onboarding_title')}
          description={
            <div className="text-center">
              {isS3User && (
                <>
                  <OdsText className="mt-8 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content5',
                    )}
                  </OdsText>
                  <OdsText className="mt-6 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content6',
                    )}
                  </OdsText>
                  <OdsText className="mt-8 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content7',
                    )}
                  </OdsText>
                </>
              )}
              {!isS3User && (
                <>
                  <OdsText className="mt-8 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content1',
                    )}
                  </OdsText>
                  <OdsText className="mt-6 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content2',
                    )}
                  </OdsText>
                  <OdsText className="mt-8 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content3',
                    )}
                  </OdsText>
                  <OdsText className="mt-8 block">
                    {t(
                      'pci_projects_project_storages_objects_onboarding_content4',
                    )}
                  </OdsText>
                </>
              )}
            </div>
          }
          orderButtonLabel={t(
            'pci_projects_project_storages_objects_onboarding_action_label',
          )}
          onOrderButtonClick={() => {
            navigate('../new');
            tracking?.trackClick({
              name: `${TRACKING_PREFIX}onboarding::add`,
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
