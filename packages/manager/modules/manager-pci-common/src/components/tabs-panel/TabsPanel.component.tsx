import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
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

export function TabsPanel({ tabs }: Readonly<TabsProps>) {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const { clearNotifications } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};

  useEffect(() => {
    const currentPath = location.pathname;

    const activeTab = tabs.find((tab) => {
      const tabPath = tab.to?.split('?')[0];
      return currentPath === tabPath;
    });

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
    <OdsTabs id="osds-tab-bar">
      {tabs.map((tab: TabItemProps) => (
        <React.Fragment key={tab.name}>
          {tab.isDisabled ? (
            <OdsTab id={`osds-tab-bar-item-${tab.name}`}>{tab.title}</OdsTab>
          ) : (
            <NavLink
              to={tab.to}
              onClick={() => tracking?.trackClick({ name: tab.tracking })}
              className="no-underline"
            >
              <OdsTab
                isSelected={tab.name === activePanel}
                id={`osds-tab-bar-item-${tab.name}`}
              >
                {tab.title}
              </OdsTab>
            </NavLink>
          )}
        </React.Fragment>
      ))}
    </OdsTabs>
  );
}
