import React, { useState, useEffect, ReactNode } from 'react';
import { Link, Location, useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

export type TabItemProps = {
  name: string;
  tracking: string;
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

export const computePathMatchers = (routes: string[], serviceName: string) => {
  return routes.map(
    (path) => new RegExp(path.replace(':serviceName', serviceName)),
  );
};

const TabsPanel: React.FC<TabsProps> = ({ tabs }) => {
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
                  actions: [tab.tracking],
                });
              }}
            >
              <OdsTab
                id={tab.name}
                role="tab"
                isSelected={activePanel === tab.name}
                isDisabled={tab.isDisabled}
              >
                {tab.title}
              </OdsTab>
            </Link>
          ),
      )}
    </OdsTabs>
  );
};

export default TabsPanel;
