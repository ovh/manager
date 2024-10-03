import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Card,
  OnboardingLayout,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
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
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';
import { GUIDES } from './onboarding.constants';
import { useAllVolumes } from '@/api/hooks/useVolume';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const context = useContext(ShellContext);
  const { navigation } = context.shell;
  const { ovhSubsidiary } = context.environment.getUser();
  const { data: project } = useProject();
  const [urlProject, setUrlProject] = useState('');
  const navigate = useNavigate();
  const { data: volumes, isPending } = useAllVolumes(projectId);

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
      label: t('pci_projects_project_storages_blocks_title'),
    },
  ];

  const tileItems = [
    {
      id: 'create-attach-volume',
      texts: {
        title: tOnBoarding(
          'pci_projects_project_storages_blocks_onboarding_guides_create-attach-volume_title',
        ),
        description: tOnBoarding(
          'pci_projects_project_storages_blocks_onboarding_guides_increase-volume-size_description',
        ),
        category: tOnBoarding('onboarding_guide_title'),
      },
      href:
        GUIDES['create-attach-volume'][ovhSubsidiary] ||
        GUIDES['create-attach-volume'].default,
    },
    {
      id: 'attach_pci_floating_ip_to_instance',
      texts: {
        title: tOnBoarding(
          'pci_projects_project_storages_blocks_onboarding_guides_configure-volume_title',
        ),
        description: tOnBoarding(
          'pci_projects_project_storages_blocks_onboarding_guides_create-attach-volume_description',
        ),
        category: tOnBoarding('onboarding_guide_title'),
      },
      href:
        GUIDES['configure-volume'][ovhSubsidiary] ||
        GUIDES['configure-volume'].default,
    },
    {
      id: 'start_load_balancer_service',
      texts: {
        title: tOnBoarding(
          'pci_projects_project_storages_blocks_onboarding_guides_increase-volume-size_title',
        ),

        description: tOnBoarding(
          'pci_projects_project_storages_blocks_onboarding_guides_configure-volume_description',
        ),
        category: tOnBoarding('onboarding_guide_title'),
      },
      href:
        GUIDES['increase-volume-size'][ovhSubsidiary] ||
        GUIDES['increase-volume-size'].default,
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isPending}
      route={`/pci/projects/${projectId}/storages/blocks`}
      condition={volumes?.length > 0}
    >
      <>
        <HidePreloader />
        {project && <OsdsBreadcrumb items={breadcrumbItems} />}

        <OnboardingLayout
          title={t('pci_projects_project_storages_blocks_title')}
          description={
            <>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-8 block"
              >
                {tOnBoarding(
                  'pci_projects_project_storages_blocks_onboarding_content1',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                className="mt-6 block"
              >
                {tOnBoarding(
                  'pci_projects_project_storages_blocks_onboarding_content2',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-6 block"
              >
                {tOnBoarding(
                  'pci_projects_project_storages_blocks_onboarding_content3',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-6 block"
              >
                {tOnBoarding(
                  'pci_projects_project_storages_blocks_onboarding_content4',
                )}
              </OsdsText>
            </>
          }
          orderButtonLabel={tOnBoarding(
            'pci_projects_project_storages_blocks_onboarding_action_label',
          )}
          onOrderButtonClick={() => navigate(`../new`)}
        >
          {tileItems.map((tile) => (
            <Card key={tile.id} href={tile.href} texts={tile.texts} />
          ))}
        </OnboardingLayout>
        <Outlet />
      </>
    </RedirectionGuard>
  );
}
