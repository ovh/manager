import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  OsdsText,
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  disabled?: boolean;
  to?: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/dashboard');

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabs[0].name);
      navigate(`${tabs[0].to}`);
    }
  }, [location.pathname]);

  return (
    <>
      <div className="py-4">
        <OsdsText
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._600}
        >
          {location.pathname.split('/')[2]}
        </OsdsText>
      </div>
      <OsdsTabs panel={panel}>
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps) => (
            <OsdsTabBarItem
              key={`osds-tab-bar-item-${tab.name}`}
              panel={tab.name}
              disabled={tab.disabled}
              className="flex items-center justify-center"
            >
              <NavLink to={tab.to} className="no-underline">
                {tab.title}
              </NavLink>
              {tab.disabled && (
                <OsdsChip size={ODS_CHIP_SIZE.sm} inline className="ml-2">
                  {t('key_management_service_dashboard_tab_comming_soon')}
                </OsdsChip>
              )}
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <Outlet />
    </>
  );
};

export default Dashboard;
