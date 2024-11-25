import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export type TabItemProps = {
  name: string;
  title: string | JSX.Element;
  to?: string;
  tracking?: string;
  isDisabled?: boolean;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

export default function TabsPanel({ tabs }: Readonly<TabsProps>) {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const { clearNotifications } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname === tab.to);
    if (activeTab) {
      if (activeTab.name !== activePanel) {
        clearNotifications();
      }
      setActivePanel(activeTab.name);
    } else {
      clearNotifications();
      setActivePanel(tabs[0].name);
    }
  }, [location.pathname]);

  return (
    <OsdsTabs panel={activePanel}>
      <OsdsTabBar slot="top">
        {tabs.map((tab: TabItemProps) => (
          <React.Fragment key={`osds-tab-bar-item-${tab.name}`}>
            {tab.isDisabled ? (
              <div>
                <OsdsTabBarItem
                  panel={tab.name}
                  disabled={tab.isDisabled || undefined}
                >
                  {tab.title}
                </OsdsTabBarItem>
              </div>
            ) : (
              <NavLink
                to={tab.to}
                onClick={() => tracking?.trackClick({ name: tab.tracking })}
                className="no-underline"
              >
                <OsdsTabBarItem
                  panel={tab.name}
                  disabled={tab.isDisabled || undefined}
                >
                  {tab.title}
                </OsdsTabBarItem>
              </NavLink>
            )}
          </React.Fragment>
        ))}
      </OsdsTabBar>
    </OsdsTabs>
  );
}
