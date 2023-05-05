import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsDivider,
  OsdsTabBarItem,
} from '@ovhcloud/ods-stencil/components/react';
import './dashboard.scss';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

const DashboardLayoutHelpers: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(undefined);
    }
  }, [location.pathname]);

  return (
    <div className="dashboard-layout-helpers">
      <OsdsTabs panel={panel}>
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps, key: number) => (
            <OsdsTabBarItem key={`osds-tab-bar-item-${key}`} panel={tab.name}>
              <NavLink to={tab.to}>{tab.title}</NavLink>
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <OsdsDivider separator />
      <Outlet />
    </div>
  );
};

export default DashboardLayoutHelpers;
