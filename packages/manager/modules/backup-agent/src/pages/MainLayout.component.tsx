import React, { Suspense, useContext, useMemo } from 'react';

import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Breadcrumb,
  GuideButton,
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BackupAgentContext } from '@/BackupAgent.context';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import { useMainGuideItem } from '@/hooks/useMainGuideItem';
import { LABELS } from '@/module.constants';
import { urls } from '@/routes/routes.constants';

import { useDashboardTabs } from './_hooks/useDashboardTabs';

export default function MainLayout() {
  const { appName } = useContext(BackupAgentContext);
  const { t } = useTranslation([NAMESPACES.ACTIONS]);

  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const queryClient = useQueryClient();
  const tabs = useDashboardTabs();

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.to && location.pathname.startsWith(tab.to)) ?? tabs[0],
    [tabs, location.pathname],
  );

  const {
    isPending,
    data: isBackupAgentReady,
    isError: isVautError,
  } = useQuery({
    ...vaultsQueries.withClient(queryClient).list(),
    retry: false,
    select: (vaults) => vaults.filter((vault) => vault.currentState.status === 'READY').length >= 1,
  });

  const guideItems = useMainGuideItem();

  return (
    <RedirectionGuard
      route={urls.onboarding}
      isLoading={isPending}
      condition={!isBackupAgentReady || isVautError}
    >
      <BaseLayout
        header={{ title: LABELS.BACKUP_AGENT, headerButton: <GuideButton items={guideItems} /> }}
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
    </RedirectionGuard>
  );
}
