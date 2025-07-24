import {
  Tab,
  TabContent,
  TabList,
  Tabs,
  TabsValueChangeEvent,
} from '@ovhcloud/ods-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServiceDetailTabsProps } from '@/domain/constants/serviceDetail';
import { TDomainResource } from '@/domain/types/domainResource';
import DnsConfigurationTab from '@/domain/pages/domainTabs/dns/dnsConfiguration';

interface ServiceDetailsTabsProps {
  readonly domainResource: TDomainResource;
}

export default function ServiceDetailsTabs({
  domainResource,
}: ServiceDetailsTabsProps) {
  const { t } = useTranslation(['domain']);
  const location = useLocation();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleValueChange = (event: TabsValueChangeEvent) => {
    navigate(`${event.value}`, { replace: true });
    setValue(event.value);
  };

  useEffect(() => {
    const tab =
      ServiceDetailTabsProps.find((tabName) =>
        location.pathname.endsWith(tabName.value),
      )?.value || 'information';
    if (location.pathname) {
      setValue(tab);
    }
  }, [location.pathname]);

  return (
    <Tabs defaultValue={value} onValueChange={handleValueChange} value={value}>
      <TabList>
        {ServiceDetailTabsProps.map((tab) => {
          return (
            <Tab key={tab.id} value={tab.value} data-testid={tab.id}>
              {t(tab.name)}
            </Tab>
          );
        })}
      </TabList>
      <TabContent value="dns">
        <DnsConfigurationTab domainResource={domainResource} />
      </TabContent>
    </Tabs>
  );
}
