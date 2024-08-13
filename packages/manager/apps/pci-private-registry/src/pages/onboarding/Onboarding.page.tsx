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
import { Outlet, useHref, useParams } from 'react-router-dom';
import {
  OnboardingLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { Suspense } from 'react';
import { useGetAllRegistries } from '@/api/hooks/useRegistry';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { data: project, isPending: isPendingProject } = useProject(projectId);
  const urlProject = useProjectUrl('public-cloud');
  const hrefCreate = useHref('../create');

  const {
    data: registries,
    isPending: isAllRegistriesPending,
  } = useGetAllRegistries(projectId);

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('private_registry_title'),
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isAllRegistriesPending || isPendingProject}
      route={`/pci/projects/${projectId}/private-registry`}
      condition={registries?.length > 0}
    >
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}
      <OnboardingLayout
        title={t('private_registry_title')}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {t('private_registry_onboarding_content1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              className="mt-4 block"
            >
              {t('private_registry_onboarding_content2')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-4 block"
            >
              {t('private_registry_onboarding_content3')}
            </OsdsText>
          </>
        }
        orderButtonLabel={t('private_registry_onboarding_action_label')}
        orderHref={hrefCreate}
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
