import React, { Suspense, useContext, useMemo } from 'react';

import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Breadcrumb,
  GuideButton,
  GuideItem,
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BackupAgentContext } from '@/BackupAgent.context';
import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupVaultsList } from '@/data/hooks/vaults/getVault';
import { useGuideUtils } from '@/hooks/useGuideUtils';
import { LABELS } from '@/module.constants';
import { urls } from '@/routes/routes.constants';

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

  const { isPending, flattenData: vaults, isError: isVautError } = useBackupVaultsList();
  const guides = useGuideUtils();

  const guideItems: GuideItem[] = [
    {
      id: 0,
      label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:backup_agent_guide`),
      href: guides.main ?? '',
      target: '_blank',
    },
  ];

  return (
    <RedirectionGuard
      route={urls.onboarding}
      isLoading={isPending}
      condition={vaults?.length === 0 || isVautError}
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
