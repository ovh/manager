import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';

import { Breadcrumb, BaseLayout } from '@ovh-ux/manager-react-components';

import appConfig from '@/web-ongoing-operations.config';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  const tabsList: DashboardTabItemProps[] = [];

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
    title: t('title'),
  };

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={appConfig.rootLabel}
          appName="web-ongoing-operations"
        />
      }
      header={header}
      description="Description du web-ongoing-operations"
      tabs={
        <OdsTabs>
          {tabsList.map((tab: DashboardTabItemProps) => (
            <OdsTab key={`osds-tab-bar-item-${tab.name}`}>
              <NavLink to={tab.to} className="no-underline">
                {tab.title}
              </NavLink>
            </OdsTab>
          ))}
        </OdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
