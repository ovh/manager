import React, { Suspense, startTransition, useContext } from 'react';

import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Breadcrumb, GuideButton } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BackupAgentContext } from '@/BackupAgent.context';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import { selectVaultName } from '@/data/selectors/vaults.selectors';
import { useMainGuideItem } from '@/hooks/useMainGuideItem';

import { useVaultDashboardTabs } from './_hooks/useVaultDashboardTabs';

export default function VaultDashboardPage() {
  const { appName } = useContext(BackupAgentContext);
  const { vaultId } = useParams<{ vaultId: string }>();
  const queryClient = useQueryClient();
  const { data: vaultName } = useQuery({
    ...vaultsQueries.withClient(queryClient).detail(vaultId!),
    select: selectVaultName,
  });
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const { trackClick } = useOvhTracking();

  const tabs = useVaultDashboardTabs();

  const guideItems = useMainGuideItem();

  const onNavigateBackClicked = () => {
    startTransition(() => navigate('..'));
  };

  return (
    <BaseLayout
      header={{
        title: vaultName ?? vaultId,
        headerButton: <GuideButton items={guideItems} />,
      }}
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
