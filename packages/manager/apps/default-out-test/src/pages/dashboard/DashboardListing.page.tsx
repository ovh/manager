import React, { Suspense, useMemo } from 'react';

import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout, HeadersProps } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useBreadcrumb } from '@/hooks/breadcrumb/useBreadcrumb';
import { useDashboardHeader } from '@/hooks/dashboard-header/useDashboardHeader';
import { useDashboardTabs } from '@/hooks/dashboard-tabs/useDashboardTabs';

export default function DashboardListing() {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const header: HeadersProps = useDashboardHeader();
  const tabs = useDashboardTabs();
  const breadcrumbItems = useBreadcrumb({ rootLabel: t('common:home') });

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => location.pathname === tab.to) ??
      tabs.find((tab) => tab.to && location.pathname.startsWith(tab.to)),
    [tabs, location.pathname],
  );

  return (
    <>
      <BaseLayout
        header={header}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        tabs={
          tabs.length > 0 ? (
            <OdsTabs>
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.to}
                  className="no-underline"
                  onClick={() => {
                    if (tab.trackingActions?.length) {
                      trackClick({ actions: tab.trackingActions });
                    }
                  }}
                >
                  <OdsTab isSelected={tab.name === activeTab?.name}>{tab.title}</OdsTab>
                </NavLink>
              ))}
            </OdsTabs>
          ) : undefined
        }
      />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}
