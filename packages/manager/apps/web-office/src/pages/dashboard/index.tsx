import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams, useResolvedPath } from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  useNotifications,
  GuideButton,
  GuideItem,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { GUIDES_LIST } from '@/guides.constants';
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
  const { notifications } = useNotifications();
  const basePath = useResolvedPath('').pathname;
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
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

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: (GUIDES_LIST.office_guides.url[ovhSubsidiary] ||
        GUIDES_LIST.office_guides.url.DEFAULT) as string,
      target: '_blank',
      label: t('microsoft_office_dashboard_guides'),
    },
  ];
  const header = {
    title: serviceName,
    headerButton: <GuideButton items={guideItems} />,
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      tabs={<TabsPanel tabs={tabsList} />}
      message={
        // temporary fix margin even if empty
        notifications.length ? <Notifications /> : null
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
