import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { DASHBOARD_NAV_TABS } from '@/routes/Routes.constants';
import { DashboardTabType } from '@/types/Dashboard.type';

export function useDashboardTabs(): DashboardTabType[] {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  return useMemo(
    () =>
      DASHBOARD_NAV_TABS.map((tab) => {
        const resolvedTo = tab.to.replace(':id', id ?? '');
        return {
          ...tab,
          to: resolvedTo,
          isActive: pathname === resolvedTo || tab.pathMatchers?.some((rx) => rx.test(pathname)),
        };
      }),
    [pathname, id],
  );
}
