import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';
import { useOrganization } from '@/hooks';

export type TabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
  hidden?: boolean;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

export const AccountTabsPanel: React.FC<TabsProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useOrganization();

  useEffect(() => {
    if (!location.pathname) {
      setActivePanel(tabs[0].name);
      navigate(tabs[0].to);
    } else {
      const activeTab = tabs.find(
        (tab) =>
          tab.to === location.pathname ||
          tab.pathMatchers?.some((pathMatcher) =>
            pathMatcher.test(location.pathname),
          ),
      );
      if (activeTab) {
        setActivePanel(activeTab.name);
      }
    }
  }, [location.pathname]);

  return (
    <OsdsTabBar slot="top">
      <OsdsTabs panel={activePanel}>
        {tabs.map((tab: TabItemProps) => (
          <NavLink
            key={`osds-tab-bar-item-${tab.name}`}
            to={data?.id ? `${tab.to}?organizationId=${data?.id}` : tab.to}
            className="no-underline"
          >
            <OsdsTabBarItem panel={tab.name}>{tab.title}</OsdsTabBarItem>
          </NavLink>
        ))}
      </OsdsTabs>
    </OsdsTabBar>
  );
};
