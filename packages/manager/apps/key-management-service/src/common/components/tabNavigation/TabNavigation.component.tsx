import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';

export type TabNavigationItem = {
  name: string;
  url: string;
  title: string;
};

export type TabNavigationProps = {
  tabs: TabNavigationItem[];
};

/**
 * Get the index of the active tab based on the current path.
 */
function getActiveTab(tabs: TabNavigationItem[], currentPath: string): number {
  // Find the tab with the longest matching URL prefix
  let bestMatchIndex = -1;
  let bestMatchLength = 0;

  tabs.forEach((tab, index) => {
    if (currentPath.startsWith(tab.url) && tab.url.length > bestMatchLength) {
      bestMatchIndex = index;
      bestMatchLength = tab.url.length;
    }
  });

  return bestMatchIndex;
}

export const TabNavigation = ({ tabs }: TabNavigationProps) => {
  const location = useLocation();
  const activeTabIndex = getActiveTab(tabs, location.pathname);

  return (
    <OdsTabs>
      {tabs.map((tab, index) => (
        <NavLink
          key={`osds-tab-bar-item-${tab.name}`}
          to={tab.url}
          className="no-underline"
          tabIndex={-1}
        >
          <OdsTab
            id={tab.name}
            data-testid={tab.name}
            role="tab"
            isSelected={activeTabIndex === index}
          >
            {tab.title}
          </OdsTab>
        </NavLink>
      ))}
    </OdsTabs>
  );
};
