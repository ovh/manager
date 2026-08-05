import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  ChangelogButton,
  Headers,
  PciGuidesHeader,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  OsdsBreadcrumb,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabPanel,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';
import FloatingIPComponent from '@/components/list/FloatingIP.component';
import FailoverIPComponent from '@/components/list/FailoverIP.component';
import BasicIPComponent from '@/components/list/BasicIP.component';
import { CHANGELOG_LINKS, IPsTabName } from '@/constants';
import { useProductMaintenance } from '@/components/maintenance/useMaintenance';
import { MaintenanceBanner } from '@/components/maintenance/MaintenanceBanner.component';
import ListGuard from './ListGuard';
import { CHANGELOG_CHAPTERS } from '@/tracking.constants';
import { useRepricing } from '@/hooks/useRepricing';

const getActiveTab = (pathname: string) => {
  if (pathname.includes('additional-ips')) {
    return IPsTabName.ADDITIONAL_IP_TAB_NAME;
  }
  if (pathname.includes('basic-ips')) {
    return IPsTabName.BASIC_IP_TAB_NAME;
  }
  return IPsTabName.FLOATING_IP_TAB_NAME;
};

const TAB_TITLES: Record<IPsTabName, string> = {
  [IPsTabName.FLOATING_IP_TAB_NAME]: 'pci_additional_ips_floating_ip_title',
  [IPsTabName.ADDITIONAL_IP_TAB_NAME]: 'pci_additional_ips_failover_ip_title',
  [IPsTabName.BASIC_IP_TAB_NAME]: 'pci_additional_ips_basic_ip_title',
};

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('common');
  const [projectUrl, setProjectUrl] = useState('');
  const navigation = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { projectId } = useParams();
  const { data: project } = useProject();
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(projectId);
  const { isRepricingEnabled, isLoading: isRepricingLoading } = useRepricing();
  const activeTab = getActiveTab(location.pathname);

  const handlerTabChanged = (event: CustomEvent) => {
    clearNotifications();
    switch (event.detail?.panel) {
      case IPsTabName.FLOATING_IP_TAB_NAME:
        navigate('../floating-ips');
        break;
      case IPsTabName.BASIC_IP_TAB_NAME:
        navigate('../basic-ips');
        break;
      default:
        navigate('../additional-ips');
    }
  };

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  if (
    activeTab === IPsTabName.BASIC_IP_TAB_NAME &&
    !isRepricingLoading &&
    !isRepricingEnabled
  ) {
    return <Navigate to="../floating-ips" replace />;
  }

  return (
    <ListGuard projectId={projectId}>
      <>
        <HidePreloader />
        {project && (
          <OsdsBreadcrumb
            items={[
              {
                href: projectUrl,
                label: project.description,
              },
              {
                label: t('pci_additional_ips_title'),
              },
              {
                label: t(TAB_TITLES[activeTab]),
              },
            ]}
          />
        )}
        <div className="header mb-10 mt-8">
          <Headers
            title={t('pci_additional_ips_title')}
            description={t('pci_additional_ips_additional_ips_description')}
            headerButton={
              <PciGuidesHeader category="instances"></PciGuidesHeader>
            }
            changelogButton={
              <ChangelogButton
                links={CHANGELOG_LINKS}
                chapters={CHANGELOG_CHAPTERS}
              />
            }
          />
        </div>

        <PciAnnouncementBanner projectId={projectId} />

        <div className="mb-5">
          <PciDiscoveryBanner project={project} />

          {hasMaintenance && (
            <div className="mt-5">
              <MaintenanceBanner maintenanceURL={maintenanceURL} />
            </div>
          )}
        </div>

        <OsdsTabs
          panel={activeTab}
          onOdsTabsChanged={(event) => handlerTabChanged(event)}
        >
          <OsdsTabBar slot="top">
            <OsdsTabBarItem
              panel={IPsTabName.FLOATING_IP_TAB_NAME}
              className="flex items-center justify-center"
            >
              {t('pci_additional_ips_floating_ip_title')}
            </OsdsTabBarItem>
            <OsdsTabBarItem
              panel={IPsTabName.ADDITIONAL_IP_TAB_NAME}
              className="flex items-center justify-center"
            >
              {t('pci_additional_ips_failover_ip_title')}
            </OsdsTabBarItem>
            {isRepricingEnabled && (
              <OsdsTabBarItem
                panel={IPsTabName.BASIC_IP_TAB_NAME}
                className="flex items-center justify-center"
              >
                {t('pci_additional_ips_basic_ip_title')}
              </OsdsTabBarItem>
            )}
          </OsdsTabBar>

          <OsdsTabPanel name={IPsTabName.FLOATING_IP_TAB_NAME}>
            {activeTab === IPsTabName.FLOATING_IP_TAB_NAME && (
              <FloatingIPComponent
                projectId={projectId}
                projectUrl={projectUrl}
              />
            )}
          </OsdsTabPanel>
          <OsdsTabPanel name={IPsTabName.ADDITIONAL_IP_TAB_NAME}>
            {activeTab === IPsTabName.ADDITIONAL_IP_TAB_NAME && (
              <FailoverIPComponent
                projectId={projectId}
                projectUrl={projectUrl}
              />
            )}
          </OsdsTabPanel>
          {isRepricingEnabled && (
            <OsdsTabPanel name={IPsTabName.BASIC_IP_TAB_NAME}>
              {activeTab === IPsTabName.BASIC_IP_TAB_NAME && (
                <BasicIPComponent
                  projectId={projectId}
                  projectUrl={projectUrl}
                />
              )}
            </OsdsTabPanel>
          )}
        </OsdsTabs>
        <Outlet />
      </>
    </ListGuard>
  );
}
