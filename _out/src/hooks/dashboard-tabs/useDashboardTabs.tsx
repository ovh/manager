import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { DASHBOARD_TAB_CONFIG } from '@/routes/Routes.constant';
import { DashboardTabType } from '@/types/Dashboard.type';

export function useDashboardTabs(): DashboardTabType[] {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  return useMemo(
    () =>
      DASHBOARD_TAB_CONFIG.map((tab) => {
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
