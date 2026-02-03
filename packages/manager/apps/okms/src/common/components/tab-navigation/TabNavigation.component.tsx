import { ComponentProps, useMemo } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Badge, Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

export type TabNavigationItem = {
  name: string;
  url: string;
  title: string;
  badge?: {
    label: string;
    color: ComponentProps<typeof Badge>['color'];
  };
  tracking: TrackingTags[];
};

export type TabNavigationProps = {
  tabs: TabNavigationItem[];
};

/**
 * Get the name of the active tab based on the current path.
 */
function getActiveTab(tabs: TabNavigationItem[], currentPath: string): string | undefined {
  // Find the tab with the longest matching URL prefix
  let bestMatchTab: TabNavigationItem | undefined;
  let bestMatchLength = 0;

  tabs.forEach((tab) => {
    if (currentPath.startsWith(tab.url) && tab.url.length > bestMatchLength) {
      bestMatchTab = tab;
      bestMatchLength = tab.url.length;
    }
  });

  return bestMatchTab?.name;
}

export const TabNavigation = ({ tabs }: TabNavigationProps) => {
  const { trackClick } = useOkmsTracking();
  const location = useLocation();
  const navigate = useNavigate();
  const value = useMemo(
    () => getActiveTab(tabs, location.pathname) ?? tabs[0]?.name ?? '',
    [tabs, location.pathname],
  );

  const handleTabClicked = (event: TabsValueChangeEvent) => {
    const selectedTab = tabs.find((tab) => tab.name === event.value);
    if (selectedTab) {
      navigate(selectedTab.url);
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.tab,
        actionType: 'navigation',
        actions: selectedTab.tracking,
      });
    }
  };

  return (
    <Tabs value={value} onValueChange={handleTabClicked}>
      <TabList>
        {tabs.map((tab) => (
          <Tab
            key={`osds-tab-bar-item-${tab.name}`}
            value={tab.name}
            data-testid={tab.name}
            className="space-x-1"
          >
            <span>{tab.title}</span>
            {tab.badge && (
              <Badge color={tab.badge.color} size="sm" className="font-normal">
                {tab.badge.label}
              </Badge>
            )}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
