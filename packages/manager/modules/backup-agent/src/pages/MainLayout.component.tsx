import React, { Suspense, useContext, useMemo } from 'react';

import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Breadcrumb, Notifications } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BackupAgentContext } from '@/BackupAgent.context';
import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { LABELS } from '@/module.constants';

import { useDashboardTabs } from './_hooks/useDashboardTabs';

export default function MainLayout() {
  const { appName } = useContext(BackupAgentContext);
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON, NAMESPACES.ACTIONS]);

  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const tabs = useDashboardTabs();

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.to && location.pathname.startsWith(tab.to)) ?? tabs[0],
    [tabs, location.pathname],
  );

  return (
    <BaseLayout
      header={{ title: LABELS.BACKUP_AGENT }}
      message={<Notifications />}
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
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
