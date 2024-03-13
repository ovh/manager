import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

export type TabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

const TabsPanel: React.FC<TabsProps> = ({ tabs }) => {
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
    <OsdsTabs panel={panel}>
      <OsdsTabBar slot="top">
        {tabs.map((tab: TabItemProps) => (
          <NavLink
            key={`osds-tab-bar-item-${tab.name}`}
            to={tab.to}
            className="no-underline"
          >
            <OsdsTabBarItem panel={tab.name}>{tab.title}</OsdsTabBarItem>
          </NavLink>
        ))}
      </OsdsTabBar>
    </OsdsTabs>
  );
};

export default TabsPanel;
