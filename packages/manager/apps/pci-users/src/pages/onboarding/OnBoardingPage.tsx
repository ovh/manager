import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
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
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  TProject,
} from '@ovh-ux/manager-pci-common';
import { useAllUsers } from '@/api/hooks/useUser';

export default function OnBoardingPage() {
  const { t } = useTranslation('common');
  const { projectId } = useParams();
  const navigation = useNavigation();
  const project = useRouteLoaderData('users') as TProject;
  const [urlProject, setUrlProject] = useState('');
  const navigate = useNavigate();
  const { data: users, isLoading } = useAllUsers(projectId);

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  useEffect(() => {
    // if there are users redirect to user listing page
    if (!isLoading && users.length > 0) {
      navigate(`/pci/projects/${projectId}/users`);
    }
  }, [isLoading, users, navigate]);

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('pci_projects_project_users_title'),
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

      <div className="mb-8">
        <PciDiscoveryBanner project={project} />
      </div>

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
        {tileItems.map((tile) => (
          <Card key={tile.id} href={tile.href} texts={tile.texts} />
        ))}
      </OnboardingLayout>
      <Outlet />
    </>
  );
}
