import React, { Suspense, startTransition, useMemo } from 'react';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useDashboardTabs } from '@/hooks/dashboard/useDashboardTabs';
import { urls } from '@/routes/Routes.constants';

export default function DashboardPage() {
  const { t } = useTranslation(['common', 'dashboard']);
  const navigate = useNavigate();

  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const tabs = useDashboardTabs();

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => location.pathname === tab.to) ??
      tabs.find((tab) => tab.to && location.pathname.startsWith(tab.to)),
    [tabs, location.pathname],
  );

  const onNavigateBackClicked = () => {
    startTransition(() => navigate(`../${urls.listing}`));
  };

  return (
    <BaseLayout
      header={{ title: t('dashboard:title') }}
      backLinkLabel={t('dashboard:back')}
      onClickReturn={onNavigateBackClicked}
      breadcrumb={<Breadcrumb />}
      tabs={
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
              <OdsTab isSelected={tab.name === activeTab?.name}>{t(tab.title)}</OdsTab>
            </NavLink>
          ))}
        </OdsTabs>
      }
    >
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
