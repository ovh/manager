import {useMemo} from 'react';

import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BACKUP_AGENT_NAMESPACES } from "@/BackupAgent.translations";

import { MAIN_LAYOUT_NAV_TABS } from '@/routes/Routes.constants';
import { DashboardTabType } from '@/types/Dashboard.type';

export function useDashboardTabs(): DashboardTabType[] {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.COMMON)
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  return useMemo(
    () =>
      MAIN_LAYOUT_NAV_TABS.map((tab) => {
        const resolvedTo = tab.to.replace(':id', id ?? '');
        return {
          ...tab,
          title: t(tab.title),
          to: resolvedTo,
          isActive: pathname === resolvedTo || tab.pathMatchers?.some((rx) => rx.test(pathname)),
        };
      }),
    [pathname, id],
  );
}
