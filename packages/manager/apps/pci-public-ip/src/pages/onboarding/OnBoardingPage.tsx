import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  Card,
  OnboardingLayout,
  PciDiscoveryBanner,
  isDiscoveryProject,
} from '@ovhcloud/manager-components';
import { OdsBreadcrumbAttributeItem } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { Project } from '@/api/data/project';
import { useAllUsers } from '@/api/hooks/useUser';
import { useAllFloatingIP } from '@/api/hooks/useFloatingIP';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const navigation = useNavigation();
  const project = useRouteLoaderData('public-ips') as Project;
  const [urlProject, setUrlProject] = useState('');
  const navigate = useNavigate();
  const { data: floatingIPs, isLoading } = useAllFloatingIP(projectId);

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  useEffect(() => {
    // if there are users redirect to user listing page
    if (!isLoading && floatingIPs.length > 0) {
      navigate(`/pci/projects/${projectId}/public-ips`);
    }
  }, [isLoading, floatingIPs, navigate]);

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('pci_additional_ips_title'),
    },
  ];

  const tileItems = [
    {
      id: 'create-delete-openstack-user',
      texts: {
        title: t(
          'pci_projects_project_users_onboarding_guides_create-delete-openstack-user_title',
        ),
        description: t(
          'pci_projects_project_users_onboarding_guides_create-delete-openstack-user_description',
        ),
        category: t('onboarding_guide_title'),
      },
      href:
        'https://docs.ovh.com/gb/en/public-cloud/creation-and-deletion-of-openstack-user/',
    },
    {
      id: 'configure-horizon-user-access',
      texts: {
        title: t(
          'pci_projects_project_users_onboarding_guides_configure-horizon-user-access_title',
        ),
        description: t(
          'pci_projects_project_users_onboarding_guides_configure-horizon-user-access_description',
        ),
        category: t('onboarding_guide_title'),
      },
      href:
        'https://docs.ovh.com/gb/en/public-cloud/configure_user_access_to_horizon/',
    },
    {
      id: 'prepare-openstack-api-env',
      texts: {
        title: t(
          'pci_projects_project_users_onboarding_guides_prepare-openstack-api-env_title',
        ),
        description: t(
          'pci_projects_project_users_onboarding_guides_prepare-openstack-api-env_description',
        ),
        category: t('onboarding_guide_title'),
      },
      href:
        'https://docs.ovh.com/gb/en/public-cloud/prepare_the_environment_for_using_the_openstack_api/',
    },
  ];

  return (
    <>
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}
      {isDiscoveryProject(project) && (
        <div className="mb-8">
          <PciDiscoveryBanner projectId={projectId} />
        </div>
      )}
      <OnboardingLayout
        title={t('pci_projects_project_users_onboarding_title')}
        description={
          <>
            <span>{t('pci_projects_project_users_onboarding_content1')}</span>
            <span className="font-bold block mt-4">
              {t('pci_projects_project_users_onboarding_content2')}
            </span>
            <span>{t('pci_projects_project_users_onboarding_content3')}</span>
            <span className="block mt-4">
              {t('pci_projects_project_users_onboarding_content4')}
            </span>
          </>
        }
        /**
         * TODO: Should rename those props to make them generic because the component must be reused in other context different that order
         */
        orderButtonLabel={t(
          'pci_projects_project_users_onboarding_action_label',
        )}
        onOrderButtonClick={() => {
          if (!isDiscoveryProject(project)) navigate('./new');
        }}
        isActionDisabled={isDiscoveryProject(project)}
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
