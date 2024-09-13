import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CHIP_SIZE,
  OdsTabsChangeEventDetail,
  OsdsTabsCustomEvent,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

export type DashboardTabItemProps = {
  url: string;
  title: string;
  disabled?: boolean;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const { trackClick } = useOvhTracking();
  const location = useLocation();
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/dashboard');

  useEffect(() => {
    const activeTab = tabs.find(
      (tab) => `/${okmsId}/${tab.url}` === location.pathname,
    );
    if (!activeTab) return;
    setActivePanel(activeTab?.url);
  }, [location]);

  const handleTabChange = (
    event: OsdsTabsCustomEvent<OdsTabsChangeEventDetail>,
  ) => {
    const {
      detail: { panel },
    } = event;
    const url = `/${okmsId}/${panel}`;

    const trackingTag = panel === '' ? 'general-informations' : panel;

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: [trackingTag],
    });

    setActivePanel(panel);
    navigate(url);
  };

  return (
    <div className="mb-6">
      <OsdsTabs
        panel={activePanel}
        onOdsTabsChanged={(event) => handleTabChange(event)}
      >
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps) => (
            <OsdsTabBarItem
              key={`osds-tab-bar-item-${tab.url}`}
              panel={tab.url}
              disabled={tab.disabled}
              className="flex items-center justify-center"
            >
              {tab.title}
              {tab.disabled && (
                <OsdsChip size={ODS_CHIP_SIZE.sm} inline className="ml-2">
                  {t('key_management_service_dashboard_tab_comming_soon')}
                </OsdsChip>
              )}
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
    </div>
  );
};

export default Dashboard;
