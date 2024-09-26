import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export type TabItemProps = {
  name: string;
  title: string | JSX.Element;
  to: string;
  tracking?: string;
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
    const activeTab = tabs.find((tab) => location.pathname.includes(tab.to));
    if (activeTab) {
      if (activeTab.name !== panel) {
        clearNotifications();
      }
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
