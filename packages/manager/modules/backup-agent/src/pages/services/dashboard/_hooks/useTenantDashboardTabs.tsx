import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { TENANT_LAYOUT_NAV_TABS, urlParams } from '@/routes/routes.constants';
import { DashboardTabType } from '@/types/Dashboard.type';
import { tabsWithActiveTabOrDefault } from '@/utils/tabsWithActiveTabOrDefault';

export function useTenantDashboardTabs(): DashboardTabType[] {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.COMMON);
  const { pathname } = useLocation();
  const { tenantId } = useParams<{ tenantId: string }>();

  return useMemo(() => {
    const mappedTab = TENANT_LAYOUT_NAV_TABS.map(({ pathMatchers, title, to, ...restTab }) => {
      const resolvedTo = to.replace(urlParams.tenantId, tenantId ?? '');
      return {
        ...restTab,
        title: t(title),
        to: resolvedTo,
        isActive: pathname === resolvedTo || pathMatchers?.some((rx) => rx.test(pathname)),
      };
    });

    return tabsWithActiveTabOrDefault(mappedTab);
  }, [pathname, tenantId]);
}
