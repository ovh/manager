import React, { useState, useEffect } from 'react';
import {
  useResolvedPath,
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

import { DashboardLayout, LinkType } from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

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
  const { serviceName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-file-storage/dashboard');

  const tabsList = [
    {
      name: 'general_informations',
      title: 'Informations générales',
      to: useResolvedPath('').pathname,
    },
    {
      name: 'Tab 2',
      title: 'Tab 2',
      to: useResolvedPath('Tab2').pathname,
    },
  ];

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
    description: 'Description du pci-file-storage',
    title: serviceName,
  };

  const linkProps = {
    label: t('manager_dashboard_back_link'),
    href: '/',
    target: OdsHTMLAnchorElementTarget._blank,
    type: LinkType.back,
  };

  const onClickReturn = (href: string) => navigate(href);

  return (
    <div>
      <DashboardLayout
        header={header}
        tabs={
          <OsdsTabs panel={panel}>
            <OsdsTabBar slot="top">
              {tabsList.map((tab: DashboardTabItemProps) => (
                <OsdsTabBarItem
                  key={`osds-tab-bar-item-${tab.name}`}
                  panel={tab.name}
                >
                  <NavLink to={tab.to} className="no-underline">
                    {tab.title}
                  </NavLink>
                </OsdsTabBarItem>
              ))}
            </OsdsTabBar>
          </OsdsTabs>
        }
        breadcrumb={<Breadcrumb />}
      />
      <Outlet />
    </div>
  );
}
