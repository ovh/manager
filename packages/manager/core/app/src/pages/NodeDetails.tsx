import React from 'react';
import { Tabs, TabList, TabPanels, Tab } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useResolvedPath,
  useLocation,
} from 'react-router-dom';

export default function NodeDetailsPage(): JSX.Element {
  const { t } = useTranslation('node-dashboard');
  const { pathname } = useLocation();

  const tabs = [
    {
      name: 'general',
      title: t('tab_infos'),
      to: useResolvedPath('details').pathname,
    },
    {
      name: 'interventions',
      title: t('tab_interventions'),
      to: useResolvedPath('interventions').pathname,
    },
    {
      name: 'ipmi',
      title: t('tab_ipmi'),
      to: useResolvedPath('ipmi').pathname,
    },
    {
      name: 'tasks',
      title: t('tab_tasks'),
      to: useResolvedPath('tasks').pathname,
    },
  ];

  const tabIndex = Math.max(
    tabs.findIndex(({ to }) => pathname.startsWith(to)),
    0,
  );

  return (
    <Tabs variant="light" index={tabIndex} isLazy>
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
