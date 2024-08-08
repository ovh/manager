import React, { useEffect, useState } from 'react';
import { DashboardLayout, HeadersProps } from '@ovhcloud/manager-components';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type TDashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
  breadcrumbItems: BreadcrumbItem[];
  header: HeadersProps;
};

export default function VcdDashboardLayout({
  tabs,
  breadcrumbItems,
  header,
}: TDashboardLayoutProps) {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabs[0].name);
      navigate(`${tabs[0].to}`);
    }
  }, [location.pathname]);

  return (
    <div>
      <DashboardLayout
        header={header}
        tabs={
          <OsdsTabs panel={panel}>
            <OsdsTabBar slot="top">
              {tabs.map((tab: DashboardTabItemProps) => (
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
