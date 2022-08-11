import React from 'react';
import { Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link as RouterLink } from 'react-router-dom';

export default function DetailsPage(): JSX.Element {
  const { t } = useTranslation('details');

  const tabs = [
    {
      name: 'general',
      title: t('tab_general'),
      to: '',
    },
    {
      name: 'nodes',
      title: t('tab_nodes'),
      to: 'nodes',
    },
  ];

  return (
    <Tabs variant="light">
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.name} as={RouterLink} to={tab.to}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel key={tab.name}>
            <Outlet />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
