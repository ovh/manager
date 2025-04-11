import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';

export type TabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type TabsProps = {
  tabs: TabItemProps[];
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
      const activeTab = tabs
        .filter(
          (tab) =>
            tab.to === location.pathname ||
            tab.pathMatchers?.some((pathMatcher) =>
              pathMatcher.test(location.pathname),
            ),
        )
        .pop();
      if (activeTab) {
        setActivePanel(activeTab.name);
      }
    }
  }, [location.pathname]);

  return (
    <OdsTabs>
      {tabs.map((tab: TabItemProps) => (
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
      ))}
    </OdsTabs>
  );
};

export default TabsPanel;
