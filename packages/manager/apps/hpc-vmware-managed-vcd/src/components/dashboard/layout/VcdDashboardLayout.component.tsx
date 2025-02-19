import React from 'react';
import { HeadersProps, BaseLayout } from '@ovh-ux/manager-react-components';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { MessageList } from '@/components/message/MessageList.component';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type TDashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
  breadcrumbItems: BreadcrumbItem[];
  header: HeadersProps;
  backLinkLabel?: string;
  onClickReturn?: () => void;
};

export default function VcdDashboardLayout({
  tabs,
  breadcrumbItems,
  header,
  backLinkLabel,
  onClickReturn,
}: TDashboardLayoutProps) {
  const { pathname: path } = useLocation();

  return (
    <div>
      <BaseLayout
        header={header}
        tabs={
          <OdsTabs>
            {tabs.map((tab: DashboardTabItemProps) => (
              <NavLink to={tab.to} className="no-underline" key={tab.name}>
                <OdsTab isSelected={tab.to === path}>{tab.title}</OdsTab>
              </NavLink>
            ))}
          </OdsTabs>
        }
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        message={<MessageList />}
        backLinkLabel={backLinkLabel}
        onClickReturn={onClickReturn}
      />
      <Outlet />
    </div>
  );
}
