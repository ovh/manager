import React, { Suspense, startTransition, useContext } from 'react';

import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BackupAgentContext } from '@/BackupAgent.context';
import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import { useTenantDashboardTabs } from './_hooks/useTenantDashboardTabs';

export default function DashboardPage() {
  const { appName } = useContext(BackupAgentContext);
  const { tenantId } = useRequiredParams('tenantId');
  const { data: tenantResource } = useBackupVSPCTenantDetails({ tenantId: tenantId });
  const { t } = useTranslation([NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const { trackClick } = useOvhTracking();

  const tabs = useTenantDashboardTabs();

  const onNavigateBackClicked = () => {
    startTransition(() => navigate('..'));
  };

  return (
    <>
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
    </>
  );
}
