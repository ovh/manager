import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

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
      setActivePanel(tabs[0].to);
      navigate(tabs[0].to);
    } else {
      const activeTab = tabs
        .filter(
          (tab) =>
            tab.to === location.pathname ||
            tab.pathMatchers?.some((pathMatcher) => pathMatcher.test(location.pathname)),
        )
        .pop();
      if (activeTab) {
        setActivePanel(activeTab.to);
      }
    }
  }, [location.pathname, tabs, navigate]);

  return (
    <Tabs value={activePanel} onValueChange={(event) => navigate(event.value)}>
      <TabList>
        {tabs.map((tab: TabItemProps) => (
          <Tab key={tab.name} id={tab.name} value={tab.to}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default TabsPanel;
