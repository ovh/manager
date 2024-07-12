import {
  useEnvironment,
  useNavigation,
} from '@ovh-ux/manager-react-shell-client';
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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { PciAnnouncementBanner, TProject } from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';
import { GUIDES } from './onboarding.constants';
import OnBoardingGuard from './OnBoardingGuard';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const navigation = useNavigation();
  const { ovhSubsidiary } = useEnvironment().getUser();
  const project = useRouteLoaderData('public-ips') as TProject;
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
      label: t('pci_additional_ips_title'),
    },
  ];

  const tileItems = [
    {
      id: 'create-delete-openstack-user',
      texts: {
        title: tOnBoarding(
          'pci_additional_ips_onboarding_guides_additional_public_ips_title',
        ),
        description: tOnBoarding(
          'pci_additional_ips_onboarding_guides_additional_public_ips_description',
        ),
        category: tOnBoarding('onboarding_guide_title'),
      },
      href: GUIDES.additional_public_ips[ovhSubsidiary],
    },
    {
      id: 'configure-horizon-user-access',
      texts: {
        title: tOnBoarding(
          'pci_additional_ips_onboarding_guides_configure_additional_ip_title',
        ),
        description: tOnBoarding(
          'pci_additional_ips_onboarding_guides_configure_additional_ip_description',
        ),
        category: tOnBoarding('onboarding_guide_title'),
      },
      href: GUIDES.configure_additional_ip[ovhSubsidiary],
    },
    {
      id: 'prepare-openstack-api-env',
      texts: {
        title: tOnBoarding(
          'pci_additional_ips_onboarding_guides_configure_floating_ip_title',
        ),
        description: tOnBoarding(
          'pci_additional_ips_onboarding_guides_configure_floating_ip_description',
        ),
        category: tOnBoarding('onboarding_guide_title'),
      },
      href: GUIDES.configure_floating_ip[ovhSubsidiary],
    },
  ];

  return (
    <OnBoardingGuard projectId={projectId}>
      <>
        <HidePreloader />
        {project && <OsdsBreadcrumb items={breadcrumbItems} />}

        <PciAnnouncementBanner projectId={projectId} />

        <OnboardingLayout
          title={t('pci_additional_ips_title')}
          description={
            <>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              >
                {tOnBoarding('pci_additional_ips_onboarding_content1')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-4 block"
              >
                {tOnBoarding('pci_additional_ips_onboarding_content2')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-6 block"
              >
                {tOnBoarding('pci_additional_ips_onboarding_content3')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                className="block mt-6"
              >
                {tOnBoarding('pci_additional_ips_onboarding_content4_heading')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="block"
              >
                {tOnBoarding(
                  'pci_additional_ips_onboarding_content4_description',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                className="block mt-6"
              >
                {tOnBoarding('pci_additional_ips_onboarding_content5_heading')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="block"
              >
                {tOnBoarding(
                  'pci_additional_ips_onboarding_content5_description',
                )}
              </OsdsText>
            </>
          }
          orderButtonLabel={tOnBoarding(
            'pci_additional_ips_onboarding_action_buy',
          )}
          onOrderButtonClick={() => navigate('../order')}
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
