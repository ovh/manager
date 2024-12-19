import React, { useState, useEffect, ReactNode } from 'react';
import { Location, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';

export type TabItemProps = {
  name: string;
  title: ReactNode;
  pathMatchers?: RegExp[];
  to: string;
  hidden?: boolean;
  isDisabled?: boolean;
  component?: ReactNode;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

export const activatedTabs = (pathMatchers: RegExp[], location: Location) => {
  return pathMatchers?.some((pathMatcher) =>
    pathMatcher.test(location.pathname),
  );
};

export const computePathMatchers = (routes: string[], platformId: string) => {
  return routes.map(
    (path) => new RegExp(path.replace(':serviceName', platformId)),
  );
};

const TabsPanel: React.FC<TabsProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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
              onClick={(e) => {
                if (tab.isDisabled) {
                  e.preventDefault();
                }
              }}
              className="no-underline"
            >
              <OdsTab
                id={tab.name}
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
