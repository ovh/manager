import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';

export type TabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
  hidden?: boolean;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

export const AccountTabsPanel: React.FC<TabsProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (tabs.length > 0) {
      if (!location.pathname) {
        setActivePanel(tabs[0].name);
        navigate(tabs[0].to);
      } else {
        const activeTab = tabs.find(
          (tab) =>
            tab.to === location.pathname ||
            tab.pathMatchers?.some((pathMatcher) =>
              pathMatcher.test(location.pathname),
            ),
        );
        if (activeTab) {
          setActivePanel(activeTab.name);
        }
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
            >
              <OdsTab
                id={tab.name}
                role="tab"
                isSelected={activePanel === tab.name}
              >
                {tab.title}
              </OdsTab>
            </NavLink>
          ),
      )}
    </OdsTabs>
  );
};
