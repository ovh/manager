import React, { Suspense, startTransition, useMemo, useContext } from 'react';

import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/Routes.constants';

import { useTenantDashboardTabs } from './_hooks/useTenantDashboardTabs';
import { BackupAgentContext } from "@/BackupAgent.context";
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {useBackupTenantDetails} from "@/data/hooks/tenants/useBackupTenantDetails";

export default function DashboardPage() {
  const { appName } = useContext(BackupAgentContext)
  const { tenantId } = useParams<{ tenantId: string }>();
  const { data: tenantResource } = useBackupTenantDetails({ tenantId: tenantId! })
  const { t } = useTranslation([NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const tabs = useTenantDashboardTabs();

  const onNavigateBackClicked = () => {
    startTransition(() => navigate('..'));
  };

  return (
    <BaseLayout
      header={{ title: tenantResource?.currentState.name ?? tenantId }}
      backLinkLabel={t(`${NAMESPACES.ACTIONS}:back`)}
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
              <OdsTab isSelected={tab.isActive}>{t(tab.title)}</OdsTab>
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
