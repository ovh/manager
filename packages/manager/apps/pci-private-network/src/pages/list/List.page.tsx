import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  PciGuidesHeader,
  useNotifications,
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
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import useProject from '@/api/hooks/useProject';
import { PrivateNetworkTabName } from '@/constants';
import GlobalRegionsComponent from '@/components/global-regions/GlobalRegions.component';
import LocalZoneComponent from '@/components/local-zones/LocalZone.component';

const getActiveTab = (pathname: string) => {
  if (pathname.includes('localZone')) {
    return PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME;
  }
  return PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME;
};

export default function ListingPage() {
  const { t } = useTranslation('common');
  const [projectUrl, setProjectUrl] = useState('');

  const { clearNotifications } = useNotifications();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');

  const activeTab = getActiveTab(location.pathname);

  const handlerTabChanged = (event: CustomEvent) => {
    clearNotifications();
    switch (event.detail?.panel) {
      case PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME:
        navigate(`..`);
        break;
      default:
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
          <PciGuidesHeader category="instances"></PciGuidesHeader>
        </div>
      </div>

      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
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
            {t('pci_projects_project_network_private_global_regions_tab_label')}
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
  );
}
