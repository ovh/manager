import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useResolvedPath,
  useParams,
} from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import Errors from '@/components/Error/Error';
import { urls } from '@/routes/routes.constant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('hycu/dashboard');

  const { data: serviceDetails, error } = useServiceDetails({
    resourceName: serviceName,
  });

  const tabsList = [
    {
      name: 'general_informations',
      title: t('hycu_dashboard_generals_informations_title'),
      to: useResolvedPath('').pathname,
    },
  ] as const;

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabsList[0].name);
      navigate(`${tabsList[0].to}`);
    }
  }, [location.pathname]);

  const header = {
    title: serviceDetails?.data.resource.displayName,
    description: serviceName,
  };

  if (error) {
    return (
      <BaseLayout breadcrumb={<Breadcrumb />} header={header}>
        <Errors error={error} />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      backLinkLabel={t('hycu_dashboard_back_link')}
      onClickReturn={() => {
        navigate(urls.listing);
      }}
      tabs={
        <OsdsTabs panel={panel}>
          <OsdsTabBar slot="top">
            {tabsList.map((tab: DashboardTabItemProps) => (
              <NavLink key={tab.name} to={tab.to} className="no-underline">
                <OsdsTabBarItem
                  key={`osds-tab-bar-item-${tab.name}`}
                  panel={tab.name}
                >
                  {tab.title}
                </OsdsTabBarItem>
              </NavLink>
            ))}
          </OsdsTabBar>
        </OsdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
