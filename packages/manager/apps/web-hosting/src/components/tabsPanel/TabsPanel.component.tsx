import React, { ReactNode, useEffect, useState } from 'react';

import { Location, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { replaceAll } from '@/utils/string';

export type TabItemProps = {
  name: string;
  trackingName: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
  hidden?: boolean;
  isDisabled?: boolean;
  component?: ReactNode;
};

export type TabsPanelProps = {
  tabs: TabItemProps[];
};

export const activatedTabs = (pathMatchers: RegExp[], location: Location) => {
  return pathMatchers?.some((pathMatcher) => pathMatcher.test(location.pathname));
};

export const useComputePathMatchers = (routes: string[]) => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const replacements = { ':serviceName': serviceName || '' };
  return routes.map((path) => new RegExp(`^${replaceAll(path, replacements)}$`));
};

export const TabsPanel: React.FC<TabsPanelProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  useEffect(() => {
    const activeTab =
      tabs.find((tab) => {
        const [pathname] = (tab.to || '').split('?');
        return (
          pathname === location.pathname ||
          tab.pathMatchers?.some((pathMatcher) => pathMatcher.test(location.pathname))
        );
      }) || tabs[0];

    if (activeTab) {
      setActivePanel(activeTab.name);
    }
  }, [location.pathname, tabs]);

  const handleClick = (tab: TabItemProps, e: React.MouseEvent) => {
    if (tab.isDisabled) {
      e.preventDefault();
      return;
    }
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: [tab.trackingName],
    });
    navigate(tab.to);
  };

  return (
    <Tabs>
      <TabList>
        {tabs.map(
          (tab) =>
            !tab.hidden && (
              <Tab
                key={tab.name}
                id={tab.name}
                data-testid={tab.name}
                role="tab"
                aria-selected={activePanel === tab.name}
                disabled={tab.isDisabled}
                name={tab.name}
                value={tab.title}
                onClick={(e) => handleClick(tab, e)}
              >
                {tab.title}
              </Tab>
            ),
        )}
      </TabList>
    </Tabs>
  );
};

export default TabsPanel;
