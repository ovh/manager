import React, {Suspense, startTransition, useMemo, useContext} from 'react';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { urls } from '../routes/Routes.constants';

import { useDashboardTabs } from './_hooks/useDashboardTabs';
import {BackupAgentContext} from "../BackupAgent.context";

export default function MainLayout() {
  const { appName } = useContext(BackupAgentContext);
  const { t } = useTranslation(['common', 'dashboard']);
  const navigate = useNavigate();

  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const tabs = useDashboardTabs();

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => location.pathname === `${urls.dashboard}/${tab.to}`) ??
      tabs.find((tab) => tab.to && location.pathname.startsWith(`${urls.dashboard}/${tab.to}`)) ??
      tabs[0],
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
      breadcrumb={<Breadcrumb appName={appName} rootLabel={appName} />}
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
      <BackupAgentContext.Provider value={{appName: "Backup Agent", scope: "Enterprise"}}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>

      </BackupAgentContext.Provider>
    </BaseLayout>
  );
}
