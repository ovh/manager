import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import React, { useContext, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

type TabItemProps = {
  name: string;
  title: string | JSX.Element;
  to?: string;
  tracking?: string;
  isDisabled?: boolean;
};

type TabsProps = {
  tabs: TabItemProps[];
  activePanelName: string;
  setActivePanelName: (state: string) => void;
};

export default function TabsPanel({
  tabs,
  activePanelName,
  setActivePanelName,
}: Readonly<TabsProps>) {
  const location = useLocation();
  const { clearNotifications } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};

  useEffect(() => {
    let tabName = 'cpbc_tab_consumption';

    if (location.pathname.includes('history')) {
      tabName = 'cpbc_tab_history';
    } else if (location.pathname.includes('estimate')) {
      tabName = 'cpbc_tab_forecast';
    }

    if (tabName !== activePanelName) {
      clearNotifications();
    }

    setActivePanelName(tabName);
  }, [location.pathname]);

  return (
    <OsdsTabs panel={activePanelName}>
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
