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
import { TProject } from '@ovh-ux/manager-pci-common';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { GUIDES } from './onboarding.constants';
import OnBoardingGuard from './OnboardingGuard';

export default function OnBoardingPage() {
  const { t } = useTranslation('listing');
  const { t: tOnboarding } = useTranslation('onboarding');

  const { projectId } = useParams();
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { navigation } = context.shell;
  const { ovhSubsidiary } = context.environment.getUser();
  const project = useRouteLoaderData('private-networks') as TProject;
  const [urlProject, setUrlProject] = useState('');

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
      label: tOnboarding('pci_projects_project_network_private'),
    },
  ];

  return (
    <OnBoardingGuard projectId={projectId}>
      <>
        {project && <OsdsBreadcrumb items={breadcrumbItems} />}

        <OnboardingLayout
          title={tOnboarding('pci_projects_project_network_private')}
          description={
            <>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {tOnboarding(
                  'pci_projects_project_network_private_vrack_empty',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                className="mt-6 block"
              >
                {tOnboarding(
                  'pci_projects_project_network_private_vrack_deploy',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-4 block"
              >
                {tOnboarding(
                  'pci_projects_project_network_private_vrack_explanation_1',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-6 block"
              >
                {tOnboarding(
                  'pci_projects_project_network_private_vrack_explanation_2',
                )}
              </OsdsText>
            </>
          }
          orderButtonLabel={t('pci_projects_project_network_private_create')}
          onOrderButtonClick={() => navigate('../new')}
        >
          {GUIDES.map((guide) => {
            const card = {
              id: guide.id,
              href: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
              texts: {
                title: tOnboarding(
                  `pci_projects_project_network_private_vrack_guides_${guide.id}_title`,
                ),
                category: tOnboarding('onboarding_guide_title'),
              },
            };

            return <Card key={card.id} href={card.href} texts={card.texts} />;
          })}
        </OnboardingLayout>
        <Outlet />
      </>
    </OnBoardingGuard>
  );
}
