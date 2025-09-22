import { Suspense, useContext, useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsLink, OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Card,
  OnboardingLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useAvailableRegions } from '@/api/hooks/useAvailableRegions';
import { useAllKube } from '@/api/hooks/useKubernetes';

import { GUIDES } from './constants';

export default function OnBoardingPage() {
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const urlProject = useProjectUrl('public-cloud');
  const navigate = useNavigate();

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const tileItems = GUIDES.map((guide) => ({
    id: guide.id,
    href: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
    texts: {
      category: tOnBoarding('onboarding_guide_title'),
      description: tOnBoarding(
        `pci_projects_project_kubernetes_onboarding_guides_${guide.id}_description`,
      ),
      title: tOnBoarding(`pci_projects_project_kubernetes_onboarding_guides_${guide.id}_title`),
    },
  }));

  const { data: availableRegions, isPending: isAvailableRegionsPending } =
    useAvailableRegions(projectId);

  const canCreateCluster = useMemo(() => availableRegions?.length > 0, [availableRegions]);

  const { data: clusters, isPending: isClustersPending } = useAllKube(projectId);

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: tOnBoarding('pci_projects_project_kubernetes_title'),
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isClustersPending || isAvailableRegionsPending}
      route={`/pci/projects/${projectId}/kubernetes`}
      condition={clusters?.length > 0}
    >
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}
      <OnboardingLayout
        title={tOnBoarding('pci_projects_project_kubernetes_title')}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {tOnBoarding('pci_projects_project_kubernetes_onboarding_content1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              className="mt-6 block"
            >
              {tOnBoarding('pci_projects_project_kubernetes_onboarding_content2')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-6 block"
            >
              {tOnBoarding('pci_projects_project_kubernetes_onboarding_content3')}
            </OsdsText>
            {!canCreateCluster && (
              <OsdsMessage
                color={ODS_THEME_COLOR_INTENT.warning}
                icon={ODS_ICON_NAME.WARNING}
                className="mt-8"
              >
                <div>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    className="mt-6 block"
                  >
                    {tOnBoarding('pci_projects_project_kubernetes_onboarding_regions_unavailable')}
                  </OsdsText>

                  <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} className="mt-4">
                    {tOnBoarding('pci_projects_project_kubernetes_onboarding_regions_create')}
                  </OsdsLink>
                </div>
              </OsdsMessage>
            )}
          </>
        }
        orderButtonLabel={
          canCreateCluster
            ? tOnBoarding('pci_projects_project_kubernetes_onboarding_action_label')
            : undefined
        }
        onOrderButtonClick={() => navigate(`/pci/projects/${projectId}/kubernetes/new`)}
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
