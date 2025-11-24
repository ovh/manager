import { useMemo } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TabNavigation } from '@/components/dashboard/tab-navigation/TabNavigation.component';
import { TabNavigationItem } from '@/components/dashboard/tab-navigation/TabNavigationItem.type';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';

export default function TenantDashboardPage() {
  const { t } = useTranslation('tenants');

  const { selectedService } = useObservabilityServiceContext();

  const tabs: TabNavigationItem[] = useMemo(
    () => [
      {
        name: 'general-information',
        title: t('dashboard.general_information_tab'),
        url: '',
      },
      {
        name: 'subscription',
        title: t('dashboard.subscription_tab'),
        url: 'subscription',
      },
      {
        name: 'tags',
        title: t('dashboard.tags_tab'),
        url: 'tags',
      },
    ],
    [t],
  );

  if (!selectedService || !selectedService.id) {
    return null;
  }

  return (
    <section>
      <TabNavigation tabs={tabs} />
      <Outlet />
    </section>
  );
}
