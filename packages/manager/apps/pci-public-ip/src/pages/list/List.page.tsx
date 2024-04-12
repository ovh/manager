import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  PciGuidesHeader,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabPanel,
  OsdsTabs,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useProject from '@/api/hooks/useProject';
import FloatingIPComponent from '@/components/list/FloatingIP.component';
import FailoverIPComponent from '@/components/list/FailoverIP.component';
import { IPsTabName } from '@/constants';
import { MaintenanceBanner } from '@/components/maintenance/MaintenanceBanner';
import { useProductMaintenance } from '@/components/maintenance/useMaintenance';

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('common');
  const [projectUrl, setProjectUrl] = useState('');
  const [activeTab, setActiveTab] = useState<IPsTabName>(
    IPsTabName.FLOATING_IP_TAB_NAME,
  );

  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(projectId);

  const handlerTabChanged = (event: CustomEvent) => {
    const { panel } = event.detail;
    setActiveTab(panel as IPsTabName);

    if (panel === IPsTabName.FLOATING_IP_TAB_NAME) {
      navigate(`../floating-ips`);
      return;
    }
    navigate(`../additional-ips`);
  };

  useEffect(() => {
    if (location.pathname.includes('floating-ips')) {
      setActiveTab(IPsTabName.FLOATING_IP_TAB_NAME);
    } else if (location.pathname.includes('additional-ips')) {
      setActiveTab(IPsTabName.ADDITIONAL_IP_TAB_NAME);
    }
  }, [location.pathname]);

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  return (
    <>
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
              label:
                activeTab === IPsTabName.ADDITIONAL_IP_TAB_NAME
                  ? t('pci_additional_ips_failover_ip_title')
                  : t('pci_additional_ips_floating_ip_title'),
            },
          ]}
        />
      )}
      <div className="header mb-10 mt-8">
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('pci_additional_ips_title')}
          </OsdsText>
          <PciGuidesHeader category="instances"></PciGuidesHeader>
        </div>
        <div className="mt-4">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {t('pci_additional_ips_additional_ips_description')}
          </OsdsText>
        </div>
      </div>

      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
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
        </OsdsTabBar>

        <OsdsTabPanel name={IPsTabName.FLOATING_IP_TAB_NAME}>
          <FloatingIPComponent projectId={projectId} projectUrl={projectUrl} />
        </OsdsTabPanel>
        <OsdsTabPanel name={IPsTabName.ADDITIONAL_IP_TAB_NAME}>
          <FailoverIPComponent projectId={projectId} projectUrl={projectUrl} />
        </OsdsTabPanel>
      </OsdsTabs>
      <Outlet />
    </>
  );
}
