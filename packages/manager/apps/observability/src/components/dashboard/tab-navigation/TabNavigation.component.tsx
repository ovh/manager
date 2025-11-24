import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';

import { TabNavigationProps } from '@/components/dashboard/tab-navigation/TabNavigation.props';
import { getActiveTab, getTabByName } from '@/utils/tab-navigation.utils';

export const TabNavigation = ({ tabs }: TabNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onTabChange = ({ value }: TabsValueChangeEvent): void => {
    const tab = getTabByName(tabs, value);
    if (tab) {
      navigate(tab.url);
    }
  };

  const activeTab = getActiveTab(tabs, location.pathname);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabList>
        {tabs.map((tab) => {
          const { name, title } = tab;
          return (
            <Tab key={name} value={name}>
              {title}
            </Tab>
          );
        })}
      </TabList>
    </Tabs>
  );
};
