import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { Card, OnboardingLayout } from '@ovhcloud/manager-components';
import { OdsBreadcrumbAttributeItem } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useHref,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { Project } from '@/data/project';

export default function OnBoardingPage() {
  const { t } = useTranslation('common');
  const { projectId } = useParams();
  const navigation = useNavigation();
  const project = useRouteLoaderData('users') as Project;
  const [urlProject, setUrlProject] = useState('');
  const hrefAddUser = useHref('./new');

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

  const descriptionContent = [
    t('pci_projects_project_users_onboarding_content1'),
    t('pci_projects_project_users_onboarding_content2'),
    t('pci_projects_project_users_onboarding_content3'),
    t('pci_projects_project_users_onboarding_content4'),
  ].join(' ');

  return (
    <>
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}
      <OnboardingLayout
        title={t('pci_projects_project_users_onboarding_title')}
        description={descriptionContent}
        /**
         * TODO: Should rename those props to make them generic because the component must be reused in other context different that order
         */
        orderButtonLabel={t(
          'pci_projects_project_users_onboarding_action_label',
        )}
        orderHref={hrefAddUser}
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
