import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovhcloud/manager-components';

export type TabItemProps = {
  name: string;
  title: string | JSX.Element;
  to: string;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

export default function TabsPanel({ tabs }: TabsProps) {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const { clearNotifications } = useNotifications();

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname.startsWith(tab.to));
    if (activeTab) {
      if (activeTab.name !== panel) clearNotifications();
      setActivePanel(activeTab.name);
    } else {
      clearNotifications();
      setActivePanel(tabs[0].name);
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
}
