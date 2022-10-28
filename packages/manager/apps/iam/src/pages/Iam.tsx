import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, Tabs, Tab, TabList, TabPanels } from '@chakra-ui/react';
import {
  NavLink,
  Outlet,
  useResolvedPath,
  useLocation,
} from 'react-router-dom';

export default function Iam() {
  const { t } = useTranslation('iam');
  const { pathname } = useLocation();

  const tabs = [
    {
      name: 'policies',
      title: t('iam_tab_policies'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'groups',
      title: t('iam_tab_groups'),
      to: useResolvedPath('groups').pathname,
    },
  ];

  let tabIndex = [...tabs]
    .reverse()
    .findIndex(({ to }) => pathname.startsWith(to));
  tabIndex = tabIndex >= 0 ? tabs.length - 1 - tabIndex : Math.max(tabIndex, 0);

  return (
    <div>
      <Heading>{t('iam_title')}</Heading>
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
    </div>
  );
}
