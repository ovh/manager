import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { BaseLayout } from '@ovh-ux/manager-react-components';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'domain',
      title: t('domain_operations_table_header_domain'),
      to: useResolvedPath('domain').pathname,
    },
    {
      name: 'dns',
      title: t('dns_operations_table_header_domain'),
      to: useResolvedPath('dns').pathname,
    },
  ];

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
      return;
    }
    setActivePanel(tabsList[0].name);
    navigate(`${tabsList[0].to}`);
  }, [location.pathname]);

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
      }}
      description={t('domain_operations_dashboard_info')}
      tabs={
        <OdsTabs>
          {tabsList.map((tab: DashboardTabItemProps) => (
            <OdsTab
              key={`osds-tab-bar-item-${tab.name}`}
              isSelected={activePanel === tab.name}
            >
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
