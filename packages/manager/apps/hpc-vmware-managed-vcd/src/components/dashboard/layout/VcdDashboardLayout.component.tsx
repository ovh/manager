import React, { useMemo } from 'react';
import { HeadersProps, BaseLayout } from '@ovh-ux/manager-react-components';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { MessageList } from '@/components/message/MessageList.component';

type Tab = {
  name: string;
  title: string;
  to: string;
};

export type TDashboardLayoutProps = {
  tabs: Tab[];
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

  const activeTab = useMemo(() => {
    const getActiveTab = () => tabs.find((tab) => tab.to === path);
    const getActiveParentTab = () =>
      tabs.find((tab) => tab.to === path.slice(0, path.lastIndexOf('/')));

    return getActiveTab() || getActiveParentTab();
  }, [tabs, path]);

  return (
    <div>
      <BaseLayout
        header={header}
        tabs={
          <OdsTabs>
            {tabs.map((tab: Tab) => (
              <NavLink to={tab.to} className="no-underline" key={tab.name}>
                <OdsTab
                  isSelected={tab.name === activeTab.name}
                  className="pb-2"
                >
                  {tab.title}
                </OdsTab>
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
