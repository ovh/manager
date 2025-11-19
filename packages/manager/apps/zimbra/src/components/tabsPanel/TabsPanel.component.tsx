import React, { ReactNode, useEffect, useState } from 'react';

import { Link, Location, useLocation, useNavigate, useParams } from 'react-router-dom';

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
      setActivePanel(tabs[0].name);
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
        setActivePanel(activeTab.name);
      }
    }
  }, [location.pathname, tabs]);

  return (
    <Tabs value={activePanel} onValueChange={(event) => setActivePanel(event.value)}>
      <TabList>
        {tabs
          .filter((tab) => !tab.hidden)
          .map((tab: TabItemProps) => (
            <Link
              key={`osds-tab-bar-item-${tab.name}`}
              to={tab.to}
              className="no-underline"
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
              <Tab
                id={tab.name}
                data-testid={tab.name}
                role="tab"
                value={tab.name}
                disabled={tab.isDisabled}
              >
                {tab.title}
              </Tab>
            </Link>
          ))}
      </TabList>
    </Tabs>
  );
};

export default TabsPanel;
