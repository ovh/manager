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
  OnboardingLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Suspense } from 'react';
import { useInstances, useProject } from '@ovh-ux/manager-pci-common';
import { useWorkflows } from '@/api/hooks/workflows';

export default function OnBoardingPage() {
  const { t } = useTranslation('listing');
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { t: tExecution } = useTranslation('executions');
  const { projectId } = useParams();
  const { data: project } = useProject();
  const navigate = useNavigate();
  const projectUrl = useProjectUrl('public-cloud');

  const { data: instances, isPending: isPendingInstances } = useInstances(
    projectId,
  );

  const { data: workflows, isPending: isPendingWorkflows } = useWorkflows(
    projectId,
  );

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: projectUrl,
      label: project?.description,
    },
    {
      label: t('pci_workflow_title'),
    },
  ];

  const handleOrderBtnClick = () => {
    if (instances?.length > 0) {
      navigate(`../new`);
    } else {
      window.location.href = `${projectUrl}/instances/new`;
    }
  };

  return (
    <RedirectionGuard
      isLoading={isPendingWorkflows || isPendingInstances}
      route={`/pci/projects/${projectId}/workflow`}
      condition={workflows?.length > 0}
    >
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}

      <OnboardingLayout
        title={t('pci_workflow_title')}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {tOnBoarding('pci_workflow_onboarding_content1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              className="mt-6 block"
            >
              {tOnBoarding('pci_workflow_onboarding_content2')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-6 block"
            >
              {tOnBoarding('pci_workflow_onboarding_content3')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-6 block"
            >
              {tOnBoarding('pci_workflow_onboarding_content4')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-6 block"
            >
              {tOnBoarding('pci_workflow_onboarding_content5')}
            </OsdsText>
            {instances?.length === 0 && (
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                className="mt-6 block"
              >
                {tOnBoarding('pci_workflow_onboarding_no_instance')}
              </OsdsText>
            )}
          </>
        }
        orderButtonLabel={
          instances?.length > 0
            ? tExecution('pci_workflow_add')
            : tOnBoarding('pci_workflow_onboarding_create_instance')
        }
        onOrderButtonClick={handleOrderBtnClick}
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
