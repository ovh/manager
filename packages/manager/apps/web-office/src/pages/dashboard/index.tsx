import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams, useResolvedPath } from 'react-router-dom';

import { BaseLayout } from '@ovh-ux/manager-react-components';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constants';
import TabsPanel from '@/components/layout-helpers/Dashboard/TabsPanel';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const basePath = useResolvedPath('').pathname;

  function computePathMatchers(routes: string[]) {
    return routes.map(
      (path) => new RegExp(path.replace(':serviceName', serviceName)),
    );
  }

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'licence',
      title: t('microsoft_office_dashboard_licences'),
      to: basePath,
      pathMatchers: computePathMatchers([urls.license]),
    },
    {
      name: 'consumption',
      title: t('microsoft_office_dashboard_consumption'),
      to: `${basePath}/consumption`,
      pathMatchers: computePathMatchers([urls.consumption]),
    },
  ];

  const header = {
    title: serviceName,
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      tabs={<TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
}
