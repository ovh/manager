import { ComponentProps } from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import { OdsBadge, OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

export type TabNavigationItem = {
  name: string;
  url: string;
  title: string;
  badge?: {
    label: string;
    color: ComponentProps<typeof OdsBadge>['color'];
  };
  tracking: TrackingTags[];
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
  const { trackClick } = useOkmsTracking();
  const location = useLocation();
  const activeTabIndex = getActiveTab(tabs, location.pathname);

  const handleTrackClickTab = (actions: TrackingTags[]) =>
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions,
    });

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
            className="space-x-1"
            onClick={() => handleTrackClickTab(tab.tracking)}
          >
            <span>{tab.title}</span>
            {tab.badge && (
              <OdsBadge
                label={tab.badge.label}
                color={tab.badge.color}
                size="sm"
                className="font-normal"
              />
            )}
          </OdsTab>
        </NavLink>
      ))}
    </OdsTabs>
  );
};
