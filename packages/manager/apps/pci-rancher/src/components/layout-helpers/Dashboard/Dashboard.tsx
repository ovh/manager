import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/tabs/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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
            >
              <NavLink to={tab.to} className="no-underline">
                {tab.title}
              </NavLink>
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <Outlet />
    </>
  );
};

export default Dashboard;
