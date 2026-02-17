import { DomainResellerTabsProps } from '@/domain-reseller/constants/constants';
import { urls } from '@/domain-reseller/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DomainResellerTabs() {
  const { t } = useTranslation(['domain-reseller', NAMESPACES.DASHBOARD]);
  const location = useLocation();
  const navigate = useNavigate();

  const currentValue = useMemo(() => {
    const currentTab = DomainResellerTabsProps.find((tab) =>
      location.pathname.includes(tab.value),
    );
    return currentTab?.value ?? urls.domainResellerInformation;
  }, [location.pathname]);

  const handleValueChange = (event: TabsValueChangeEvent) => {
    navigate(event.value, { replace: true });
  };

  return (
    <Tabs value={currentValue} onValueChange={handleValueChange}>
      <TabList>
        {DomainResellerTabsProps.map((tab) => (
          <Tab key={tab.id} value={tab.value} data-testid={tab.id}>
            {t(tab.name)}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
