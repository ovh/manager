import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { MAIN_LAYOUT_NAV_TABS } from '@/routes/routes.constants';
import { DashboardTabType } from '@/types/Dashboard.type';

export function useDashboardTabs(): DashboardTabType[] {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON, NAMESPACES.DASHBOARD]);
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  return useMemo(
    () =>
      MAIN_LAYOUT_NAV_TABS.map((tab) => {
        return {
          ...tab,
          title: t(tab.title),
          to: tab.to,
          isActive: pathname === tab.to || tab.pathMatchers?.some((rx) => rx.test(pathname)),
        };
      }),
    [pathname, id],
  );
}
