import { useQueryClient } from '@tanstack/react-query';
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
import {
  OsdsBreadcrumb,
  OsdsProgressBar,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { TProject, useOperationProgress } from '@ovh-ux/manager-pci-common';
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
import {
  PROJECT_VRACK_QUERY_KEY,
  useProjectVrack,
  VRACK_QUERY_KEY,
} from '@/api/hooks/useVrack';
import { useVrackCreationOperation } from './store';

export default function OnBoardingPage() {
  const { t } = useTranslation('listing');
  const { t: tOnboarding } = useTranslation('onboarding');
  const { t: tVrack } = useTranslation('vrack');

  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { navigation } = context.shell;
  const { ovhSubsidiary } = context.environment.getUser();
  const project = useRouteLoaderData('private-networks') as TProject;
  const [urlProject, setUrlProject] = useState('');
  const { data: vrack, isPending } = useProjectVrack(projectId);
  const { operationId, setOperationId } = useVrackCreationOperation();
  const vrackCreation = useOperationProgress(projectId, operationId, () => {
    // add a small delay in order to let the progress bar completed
    // visible for a short period of time
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: [VRACK_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [PROJECT_VRACK_QUERY_KEY],
      });
      setOperationId(null);
    }, 2000);
  });

  const isMissingVrack = !isPending && !vrack?.id;
  const isVrackCreationPending = !!operationId && !!vrackCreation;

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
              {isVrackCreationPending && (
                <>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  >
                    {tVrack(
                      'pci_projects_project_network_private_vrack_pending',
                    )}
                  </OsdsText>
                  <OsdsProgressBar
                    className="mt-8"
                    value={vrackCreation.percentage}
                  />
                </>
              )}
              {!isVrackCreationPending && (
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
              )}
            </>
          }
          {...(!isVrackCreationPending &&
            !isPending && {
              orderButtonLabel: isMissingVrack
                ? tVrack(
                    'pci_projects_project_network_private_vrack_create_heading',
                  )
                : t('pci_projects_project_network_private_create'),
            })}
          onOrderButtonClick={() =>
            isMissingVrack ? navigate('./new') : navigate('../new')
          }
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
