import { useMemo } from 'react';
import { HeadersProps, BaseLayout } from '@ovh-ux/manager-react-components';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { MessageList } from '@/components/message/MessageList.component';
import { getTabTrackingParams } from '@/tracking.constants';

export type DashboardTab = {
  name: string;
  title: string;
  to: string;
  trackingActions: string[];
};

export type TDashboardLayoutProps = {
  tabs: DashboardTab[];
  breadcrumbItems: BreadcrumbItem[];
  header: HeadersProps;
  message?: React.ReactElement;
  backLinkLabel?: string;
  onClickReturn?: () => void;
};

export default function VcdDashboardLayout({
  tabs,
  breadcrumbItems,
  header,
  message,
  backLinkLabel,
  onClickReturn,
}: TDashboardLayoutProps) {
  const { pathname: path } = useLocation();
  const { trackClick } = useOvhTracking();

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
            {tabs.map((tab: DashboardTab) => (
              <NavLink
                to={tab.to}
                className="no-underline"
                key={tab.name}
                onClick={() =>
                  trackClick(getTabTrackingParams(tab.trackingActions))
                }
              >
                <OdsTab isSelected={tab?.name === activeTab?.name}>
                  {tab.title}
                </OdsTab>
              </NavLink>
            ))}
          </OdsTabs>
        }
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        message={
          message ? (
            <>
              {message}
              <MessageList />
            </>
          ) : (
            <MessageList />
          )
        }
        backLinkLabel={backLinkLabel}
        onClickReturn={onClickReturn}
      />
      <Outlet />
    </div>
  );
}
