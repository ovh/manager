import { useMemo } from 'react';

import { Outlet, useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link, LinkType } from '@ovh-ux/muk';

import { TabNavigation } from '@/components/dashboard/tab-navigation/TabNavigation.component';
import { TabNavigationItem } from '@/components/dashboard/tab-navigation/TabNavigationItem.type';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';

export default function TenantDashboardPage() {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS]);
  const href = useHref(urls.tenants);
  const { selectedService } = useObservabilityServiceContext();

  const tabs: TabNavigationItem[] = useMemo(
    () => [
      {
        name: 'general-information',
        title: t('tenants:dashboard.general_information_tab'),
        url: '',
      },
      {
        name: 'subscription',
        title: t('tenants:dashboard.subscription_tab'),
        url: 'subscription',
      },
      {
        name: 'tags',
        title: t('tenants:dashboard.tags_tab'),
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
      <Link type={LinkType.back} href={href} className="mb-6">
        {t(`${NAMESPACES.ACTIONS}:back_to_list`)}
      </Link>
      <TabNavigation tabs={tabs} />
      <Outlet />
    </section>
  );
}
