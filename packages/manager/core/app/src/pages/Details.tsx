import React from 'react';
import { Tabs, TabList, TabPanels, Tab } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

type DetailsPageProps = {
  tabIndex: number;
  children: JSX.Element;
};

export default function DetailsPage({
  tabIndex,
  children,
}: DetailsPageProps): JSX.Element {
  const { t } = useTranslation('details');
  const { serviceId } = useParams();

  return (
    <Tabs variant="light" isLazy defaultIndex={tabIndex}>
      <TabList>
        <Tab as={NavLink} to={`/nutanix/${serviceId}`}>
          {t('tab_general')}
        </Tab>
        <Tab as={NavLink} to={`/nutanix/${serviceId}/nodes`}>
          {t('tab_nodes')}
        </Tab>
      </TabList>
      <TabPanels>{children}</TabPanels>
    </Tabs>
  );
}
