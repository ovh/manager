import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TabsComponent } from '@ovh-ux/muk';

import { getDashboardUrl } from '@/utils/dashboard/navigation.utils';

type DashboardTabsProps = {
  serviceName: string;
};

export function DashboardTabs({ serviceName }: DashboardTabsProps) {
  const { t } = useTranslation('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general-information');

  const dashboardUrl = getDashboardUrl(serviceName);
  const partitionsUrl = `${dashboardUrl}/partitions`;

  useEffect(() => {
    if (location.pathname.includes('/partitions')) {
      setActiveTab('partitions');
    } else {
      setActiveTab('general-information');
    }
  }, [location.pathname]);

  const tabsItems = ['general-information', 'partitions'];

  const handleTabChange = (value: string) => {
    if (value === 'general-information') {
      navigate(dashboardUrl);
    } else if (value === 'partitions') {
      navigate(partitionsUrl);
    }
  };

  return (
    <TabsComponent
      items={tabsItems}
      titleElement={({ item }) => {
        const label = item === 'general-information' 
          ? t('tabs.general_information')
          : t('tabs.partitions');
        return <>{label}</>;
      }}
      contentElement={() => null}
      onChange={(value) => {
        if (value && typeof value === 'object' && 'value' in value) {
          handleTabChange(value.value as string);
        }
      }}
    />
  );
}

