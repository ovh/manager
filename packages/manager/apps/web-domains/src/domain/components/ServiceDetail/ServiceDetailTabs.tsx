import { Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServiceDetailTabsProps } from '@/domain/constants/serviceDetail';

export default function ServiceDetailsTabs() {
  const { t } = useTranslation(['domain']);
  const location = useLocation();
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const handleValueChange = (event: TabsValueChangeEvent) => {
    navigate(`${event.value}`);
    setValue(event.value);
  };

  useEffect(() => {
    if (location.pathname) {
      const path = location.pathname.split('/');
      setValue(path[path.length - 1]);
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
    </Tabs>
  );
}
