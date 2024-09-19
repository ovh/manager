import { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type TabItemProps = {
  name: string;
  title: string | JSX.Element;
  to: string;
  tracking: string;
  isHidden?: boolean;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

export default function TabsPanel({ tabs }: TabsProps) {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const { clearNotifications } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};

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
        {tabs
          .filter(({ isHidden }) => !isHidden)
          .map((tab: TabItemProps) => (
            <NavLink
              key={`osds-tab-bar-item-${tab.name}`}
              to={tab.to}
              onClick={() => tracking?.trackClick({ name: tab.tracking })}
              className="no-underline"
            >
              <OsdsTabBarItem panel={tab.name}>{tab.title}</OsdsTabBarItem>
            </NavLink>
          ))}
      </OsdsTabBar>
    </OsdsTabs>
  );
}
