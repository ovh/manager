import React, { ReactNode, useEffect, useState } from 'react';

import { Location, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { replaceAll } from '@/utils';

export type TabItemProps = {
  name: string;
  trackingName: string;
  title: ReactNode;
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
  const {
    platformId,
    organizationId,
    domainId,
    accountId,
    aliasId,
    redirectionId,
    autoReplyId,
    mailingListId,
  } = useParams();

  const replacements = {
    ':platformId': platformId,
    ':organizationId': organizationId,
    ':domainId': domainId,
    ':accountId': accountId,
    ':aliasId': aliasId,
    ':redirectionId': redirectionId,
    ':autoReplyId': autoReplyId,
    ':mailingListId': mailingListId,
  };

  return routes.map((path) => new RegExp(`${replaceAll(path, replacements)}$`));
};

export const TabsPanel: React.FC<TabsPanelProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  useEffect(() => {
    if (!location.pathname) {
      setActivePanel(tabs[0].to);
      navigate(tabs[0].to);
    } else {
      const activeTab = tabs.find((tab) => {
        const [pathname] = (tab.to || '').split('?');
        return (
          pathname === location.pathname ||
          tab.pathMatchers?.some((pathMatcher) => pathMatcher.test(location.pathname))
        );
      });
      if (activeTab) {
        setActivePanel(activeTab.to);
      }
    }
  }, [location.pathname, tabs]);

  return (
    <Tabs value={activePanel} onValueChange={(event) => navigate(event.value)}>
      <TabList>
        {tabs
          .filter((tab) => !tab.hidden)
          .map((tab: TabItemProps) => (
            <Tab
              key={`osds-tab-bar-item-${tab.name}`}
              id={tab.name}
              data-testid={tab.name}
              value={tab.to}
              disabled={tab.isDisabled}
              onClick={(e) => {
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
              }}
            >
              {tab.title}
            </Tab>
          ))}
      </TabList>
    </Tabs>
  );
};

export default TabsPanel;
