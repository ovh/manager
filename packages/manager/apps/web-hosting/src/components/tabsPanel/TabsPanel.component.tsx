import React, { useState, useEffect, ReactNode } from 'react';
import {
  Location,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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
  return pathMatchers?.some((pathMatcher) =>
    pathMatcher.test(location.pathname),
  );
};

export const useComputePathMatchers = (routes: string[]) => {
  const { serviceName } = useParams();

  const replacements = {
    ':serviceName': serviceName,
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
          tab.pathMatchers?.some((pathMatcher) =>
            pathMatcher.test(location.pathname),
          )
        );
      });
      if (activeTab) {
        setActivePanel(activeTab.name);
      }
    }
  }, [location.pathname, tabs]);

  return (
    <OdsTabs>
      {tabs.map(
        (tab: TabItemProps) =>
          !tab.hidden && (
            <NavLink
              key={`osds-tab-bar-item-${tab.name}`}
              to={tab.to}
              className="no-underline"
              tabIndex={-1}
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
              <OdsTab
                id={tab.name}
                data-testid={tab.name}
                role="tab"
                isSelected={activePanel === tab.name}
                isDisabled={tab.isDisabled}
              >
                {tab.title}
              </OdsTab>
            </NavLink>
          ),
      )}
    </OdsTabs>
  );
};

export default TabsPanel;
