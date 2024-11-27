import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
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

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('pci_projects_project_storages_objects_onboarding_title'),
    },
  ];

  const isPending = isAvailabilityPending || isStoragesPending;

  return (
    <RedirectionGuard
      isLoading={isPending}
      route={`/pci/projects/${projectId}/storages/objects`}
      condition={allStorages?.resources.length > 0}
    >
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}
      <OnboardingLayout
        title={t('pci_projects_project_storages_objects_onboarding_title')}
        description={
          <>
            {isS3User && (
              <>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  className="mt-8 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content5',
                  )}
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  className="mt-6 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content6',
                  )}
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  className="mt-8 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content7',
                  )}
                </OsdsText>
              </>
            )}
            {!isS3User && (
              <>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  className="mt-8 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content1',
                  )}
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                  className="mt-6 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content2',
                  )}
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  className="mt-8 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content3',
                  )}
                </OsdsText>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  className="mt-8 block"
                >
                  {t(
                    'pci_projects_project_storages_objects_onboarding_content4',
                  )}
                </OsdsText>
              </>
            )}
          </>
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
    </RedirectionGuard>
  );
}
