import {
  PciGuidesHeader,
  useNotifications,
} from '@ovh-ux/manager-react-components';
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
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import GlobalRegionsComponent from '@/components/global-regions/GlobalRegions.component';
import LocalZoneComponent from '@/components/local-zones/LocalZone.component';
import { PrivateNetworkTabName } from '@/constants';
import { MaintenanceBanner } from '@/components/maintenance/MaintenanceBanner.component';
import { useProductMaintenance } from '@/components/maintenance/useMaintenance';
import ListGuard from './ListGuard';

const getActiveTab = (pathname: string) => {
  if (pathname.includes('localZone')) {
    return PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME;
  }
  return PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME;
};

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const [projectUrl, setProjectUrl] = useState('');

  const { clearNotifications } = useNotifications();
  const { navigation } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { data: project } = useProject();
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(projectId);
  const activeTab = getActiveTab(location.pathname);

  const handlerTabChanged = (event: CustomEvent) => {
    clearNotifications();
    if (event.detail?.panel === PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME) {
      navigate(`..`);
    } else {
      navigate(`./localZone`);
    }
  };

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  return (
    <ListGuard projectId={projectId}>
      <>
        {project && (
          <OsdsBreadcrumb
            items={[
              {
                href: projectUrl,
                label: project.description,
              },
              {
                label: t('pci_projects_project_network_private'),
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
              {t('pci_projects_project_network_private')}
            </OsdsText>
            <PciGuidesHeader category="instances" />
          </div>
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
              panel={PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}
              className="flex items-center justify-center"
            >
              {t(
                'pci_projects_project_network_private_global_regions_tab_label',
              )}
            </OsdsTabBarItem>
            <OsdsTabBarItem
              panel={PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}
              className="flex items-center justify-center"
            >
              {t('pci_projects_project_network_private_local_zones_tab_label')}
            </OsdsTabBarItem>
          </OsdsTabBar>

          <OsdsTabPanel name={PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}>
            {activeTab === PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME && (
              <GlobalRegionsComponent
                projectId={projectId}
                projectUrl={projectUrl}
              />
            )}
          </OsdsTabPanel>
          <OsdsTabPanel name={PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}>
            {activeTab === PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME && (
              <LocalZoneComponent projectId={projectId} />
            )}
          </OsdsTabPanel>
        </OsdsTabs>
        <Outlet />
      </>
    </ListGuard>
  );
}
