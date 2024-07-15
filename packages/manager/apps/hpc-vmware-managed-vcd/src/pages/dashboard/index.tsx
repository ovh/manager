import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

import { DashboardLayout } from '@ovhcloud/manager-components';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';

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
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const { data: vcdOrganisation } = useManagedVcdOrganization(id);

  const tabsList = [
    {
      name: 'general_informations',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'datacentres',
      title: t('managed_vcd_dashboard_datacentres'),
      to: useResolvedPath('datacentres').pathname,
    },
  ];

  const serviceName = vcdOrganisation?.data?.currentState?.description;
  const hasServiceRenamed = id !== serviceName;

  // TODO use iam.displayName when available
  const header = hasServiceRenamed
    ? {
        description: id,
        title: serviceName,
      }
    : { title: id };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id,
      label: serviceName,
      onClick: () => navigate(`/${id}`),
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

  return (
    <div>
      <DashboardLayout
        header={header}
        tabs={
          <OsdsTabs panel={panel}>
            <OsdsTabBar slot="top">
              {tabsList.map((tab: DashboardTabItemProps) => (
                <NavLink to={tab.to} className="no-underline" key={tab.name}>
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
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      />
      <Outlet />
    </div>
  );
}
