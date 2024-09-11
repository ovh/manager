import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { PciDiscoveryBanner, TProject } from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';
import { GUIDES } from './onboarding.constants';
import OnBoardingGuard from '@/pages/onboarding/OnBoardingGuard';
import { ACTION_PREFIX } from '@/tracking.constants';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const context = useContext(ShellContext);
  const { navigation, tracking } = context.shell;
  const { ovhSubsidiary } = context.environment.getUser();
  const project = useRouteLoaderData('public-gateway') as TProject;
  const [urlProject, setUrlProject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('pci_projects_project_public_gateway_title'),
    },
  ];

  const tileItems = [
    {
      id: 'create_private_network_with_gateway',
      texts: {
        title: tOnBoarding(
          'pci_projects_project_public_gateways_onboarding_guides_create_private_network_with_gateway_title',
        ),
        description: '',
        category: tOnBoarding('onboarding_guide_title'),
      },
      href: GUIDES.create_private_network_with_gateway[ovhSubsidiary],
    },
    {
      id: 'attach_pci_floating_ip_to_instance',
      texts: {
        title: tOnBoarding(
          'pci_projects_project_public_gateways_onboarding_guides_attach_pci_floating_ip_to_instance_title',
        ),
        description: '',
        category: tOnBoarding('onboarding_guide_title'),
      },
      href: GUIDES.attach_pci_floating_ip_to_instance[ovhSubsidiary],
    },
    {
      id: 'start_load_balancer_service',
      texts: {
        title: tOnBoarding(
          'pci_projects_project_public_gateways_onboarding_guides_start_load_balancer_service_title',
        ),
        description: '',
        category: tOnBoarding('onboarding_guide_title'),
      },
      href: GUIDES.start_load_balancer_service[ovhSubsidiary],
    },
  ];

  const createGateway = () => {
    navigate(`../new`);
    tracking.trackClick({
      name: `${ACTION_PREFIX}::onboarding::add`,
      type: 'action',
    });
  };

  return (
    <OnBoardingGuard projectId={projectId}>
      <>
        <HidePreloader />
        {project && <OsdsBreadcrumb items={breadcrumbItems} />}

        <div className="mb-8">
          <PciDiscoveryBanner project={project} />
        </div>

        <OnboardingLayout
          title={tOnBoarding('pci_projects_project_public_gateways_onboarding')}
          description={
            <>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-8 block"
              >
                {tOnBoarding(
                  'pci_projects_project_public_gateways_onboarding_content1',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-8 block"
              >
                {tOnBoarding(
                  'pci_projects_project_public_gateways_onboarding_content2',
                )}
              </OsdsText>
            </>
          }
          orderButtonLabel={tOnBoarding(
            'pci_projects_project_public_gateways_onboarding_action_label',
          )}
          onOrderButtonClick={createGateway}
        >
          {tileItems.map((tile) => (
            <Card key={tile.id} href={tile.href} texts={tile.texts} />
          ))}
        </OnboardingLayout>
        <Outlet />
      </>
    </OnBoardingGuard>
  );
}
