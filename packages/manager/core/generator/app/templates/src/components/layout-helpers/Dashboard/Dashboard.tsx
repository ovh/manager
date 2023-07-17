import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  OsdsText,
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-stencil/components/react';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';

import './Dashboard.scss';

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
    <div className="dashboard-layout-helpers">
      <div className="dashboard-layout-subtitle py-4">
        <OsdsText
          level={OdsThemeTypographyLevel.heading}
          color={OdsThemeColorIntent.text}
          size={OdsThemeTypographySize._600}
        >
          {location.pathname.split('/')[2]}
        </OsdsText>
      </div>
      <OsdsTabs panel={panel}>
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps, key: number) => (
            <OsdsTabBarItem key={`osds-tab-bar-item-${key}`} panel={tab.name}>
              <NavLink to={tab.to}>{tab.title}</NavLink>
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <Outlet />
    </div>
  );
};

export default Dashboard;
