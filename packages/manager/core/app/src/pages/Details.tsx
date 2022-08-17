import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink } from 'react-router-dom';

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

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Tabs
      variant="light"
      index={activeIndex}
      onChange={(e) => setActiveIndex(e)}
    >
      <TabList>
        {tabs.map((tab, index) => (
          <Tab as={NavLink} key={tab.name} to={tab.to}>
            {({ isActive }: { isActive: boolean }) => {
              if (isActive) setActiveIndex(index);
              return tab.title;
            }}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <Outlet />
      </TabPanels>
    </Tabs>
  );
}
