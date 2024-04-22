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
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import useProject from '@/api/hooks/useProject';
import { PrivateNetworkTabName } from '@/constants';
import GlobalRegionsComponent from '@/components/list/GlobalRegions.component';
import LocalZoneComponent from '@/components/list/LocalZone.component';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const [projectUrl, setProjectUrl] = useState('');

  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const [activeTab, setActiveTab] = useState<PrivateNetworkTabName>(
    PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME,
  );

  const handlerTabChanged = (event: CustomEvent) => {
    const { panel } = event.detail;
    setActiveTab(panel as PrivateNetworkTabName);

    if (panel === PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME) {
      navigate(`..`);
      return;
    }
    navigate(`./localZone`);
  };

  useEffect(() => {
    if (location.pathname.includes('localZone')) {
      setActiveTab(PrivateNetworkTabName.LOCALZONE_TAB_NAME);
    } else {
      setActiveTab(PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME);
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
            panel={PrivateNetworkTabName.LOCALZONE_TAB_NAME}
            className="flex items-center justify-center"
          >
            {t('pci_projects_project_network_private_local_zones_tab_label')}
          </OsdsTabBarItem>
        </OsdsTabBar>

        <OsdsTabPanel name={PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}>
          <GlobalRegionsComponent />
        </OsdsTabPanel>
        <OsdsTabPanel name={PrivateNetworkTabName.LOCALZONE_TAB_NAME}>
          <LocalZoneComponent />
        </OsdsTabPanel>
      </OsdsTabs>
      <Outlet />
    </>
  );
}
