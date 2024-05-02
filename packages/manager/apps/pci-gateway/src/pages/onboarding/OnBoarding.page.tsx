import {
  useEnvironment,
  useNavigation,
} from '@ovh-ux/manager-react-shell-client';
import {
  Card,
  isDiscoveryProject,
  OnboardingLayout,
  PciDiscoveryBanner,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { Project } from '@/api/data/project';
import { GUIDES } from './onboarding.constants';
import { useAllAggregatedGateway } from '@/api/hooks/useGateway';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const navigation = useNavigation();
  const { ovhSubsidiary } = useEnvironment().getUser();
  const project = useRouteLoaderData('public-gateway') as Project;
  const [urlProject, setUrlProject] = useState('');
  const navigate = useNavigate();

  const { data: aggregatedGateways, isLoading } = useAllAggregatedGateway(
    projectId,
  );

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  useEffect(() => {
    if (!isLoading && aggregatedGateways.length > 0) {
      navigate(`/pci/projects/${projectId}/gateway`);
    }
  }, [isLoading, aggregatedGateways, navigate]);

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
      id: 'attach_pci_floating_ip_to_instance',
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
    navigate('./new');
  };

  return (
    <>
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}

      {isDiscoveryProject(project) && (
        <div className="mb-8">
          <PciDiscoveryBanner projectId={projectId} />
        </div>
      )}
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
        <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
          {tileItems.map((tile) => (
            <Card key={tile.id} href={tile.href} texts={tile.texts} />
          ))}
        </aside>
      </OnboardingLayout>
      <Outlet />
    </>
  );
}
