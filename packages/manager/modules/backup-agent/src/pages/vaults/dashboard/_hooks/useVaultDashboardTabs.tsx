import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import {urlParams, VAULT_LAYOUT_NAV_TABS} from '@/routes/Routes.constants';
import { DashboardTabType } from '@/types/Dashboard.type';
import {BACKUP_AGENT_NAMESPACES} from "@/BackupAgent.translations";
import { useTranslation } from "react-i18next";
import {tabsWithActiveTabOrDefault} from "@/utils/tabsWithActiveTabOrDefault";

export function useVaultDashboardTabs(): DashboardTabType[] {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.COMMON)
  const { pathname } = useLocation();
  const { vaultId } = useParams<{ vaultId: string }>();


  return useMemo(
    () => {
      const mappedTab = VAULT_LAYOUT_NAV_TABS.map(({ pathMatchers, title, to, ...restTab }) => {
        const resolvedTo = to.replace(urlParams.vaultId, vaultId ?? '');
        return {
          ...restTab,
          title: t(title),
          to: resolvedTo,
          isActive: pathname === resolvedTo || pathMatchers?.some((rx) => rx.test(pathname)),
        };
      })

      return tabsWithActiveTabOrDefault(mappedTab);
    },
    [pathname, vaultId],
  );
}
