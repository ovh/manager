import { useFeatureAvailability } from '@ovh-ux/manager-react-core-application';
import {
  useEnvironment,
  useNavigation,
} from '@ovh-ux/manager-react-shell-client';
import {
  Card,
  OnboardingLayout,
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  isDiscoveryProject,
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
import { useAllFloatingIP } from '@/api/hooks/useFloatingIP';
import { Project } from '@/api/data/project';
import { GUIDES } from './onboarding.constants';
import { pciAnnouncementBannerId } from '@/constants';

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { t: tOnBoarding } = useTranslation('onboarding');
  const { projectId } = useParams();
  const navigation = useNavigation();
  const { ovhSubsidiary } = useEnvironment().getUser();
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

  const {
    data: featureAvailabilityData,
    isLoading: isFeatureAvailabilityLoading,
  } = useFeatureAvailability([pciAnnouncementBannerId]);

  useEffect(() => {
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

  const createPublicIP = () => {
    if (!isDiscoveryProject(project)) navigate('./new');
  };

  return (
    <>
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}

      {featureAvailabilityData &&
        featureAvailabilityData[pciAnnouncementBannerId] &&
        !isFeatureAvailabilityLoading && (
          <PciAnnouncementBanner projectId={projectId} />
        )}

      {isDiscoveryProject(project) && (
        <div className="mb-8">
          <PciDiscoveryBanner projectId={projectId} />
        </div>
      )}
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
        onOrderButtonClick={createPublicIP}
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
