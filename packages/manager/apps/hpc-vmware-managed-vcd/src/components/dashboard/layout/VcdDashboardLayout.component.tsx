import React, { useEffect, useState } from 'react';
import { HeadersProps, BaseLayout } from '@ovh-ux/manager-react-components';
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
  const { pathname: path } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const findActiveTab = (tabList: DashboardTabItemProps[]) =>
      tabList.find((tab) => tab.to === path);
    const findActiveParentTab = (tabList: DashboardTabItemProps[]) =>
      tabList.find((tab) => tab.to === path.slice(0, path.lastIndexOf('/')));

    const activeTab = findActiveTab(tabs) || findActiveParentTab(tabs);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabs[0].name);
      navigate(`${tabs[0].to}`);
    }
  }, [path]);

  return (
    <div>
      <BaseLayout
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
