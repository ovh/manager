import React, {Suspense, startTransition, useMemo, useContext} from 'react';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { LABELS } from "@/module.constants"
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { useDashboardTabs } from './_hooks/useDashboardTabs';
import {BackupAgentContext} from "@/BackupAgent.context";
import {BACKUP_AGENT_NAMESPACES} from "@/BackupAgent.translations";

export default function MainLayout() {
  const { appName } = useContext(BackupAgentContext);
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const tabs = useDashboardTabs();

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => tab.to && location.pathname.startsWith(`/${tab.to}`)) ??
      tabs[0],
    [tabs, location.pathname],
  );

  const onNavigateBackClicked = () => {
    startTransition(() => navigate(`../}`));
  };

  return (
    <BaseLayout
      header={{ title: LABELS.BACKUP_AGENT }}
      backLinkLabel={t(`NAMESPACES.ACTIONS:back`)}
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
