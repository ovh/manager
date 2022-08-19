import React from 'react';
import { Tabs, TabList, TabPanels, Tab } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink, resolvePath, useLocation } from 'react-router-dom';

export default function DetailsPage(): JSX.Element {
  const { t } = useTranslation('details');
  const { pathname } = useLocation();

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

  const defaultActiveIndex = tabs.findIndex(({ to }) =>
    pathname.endsWith(resolvePath(to).pathname),
  );

  return (
    <Tabs
      variant="light"
      defaultIndex={defaultActiveIndex > -1 ? defaultActiveIndex : 0}
      isLazy
    >
      <TabList>
        {tabs.map((tab) => (
          <Tab as={NavLink} key={tab.name} to={tab.to}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <Outlet />
      </TabPanels>
    </Tabs>
  );
}
