import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { DashboardTabType } from '@/types/Dashboard.type';

// Dashboard navigation tabs configuration
const DASHBOARD_NAV_TABS: Omit<DashboardTabType, 'isActive'>[] = [
  {
    name: 'general-information',
    title: 'General information',
    to: '/bmc-nasha/dashboard/:id',
    trackingActions: ['dashboard', 'general-information'],
  },
  {
    name: 'partitions',
    title: 'Partitions',
    to: '/bmc-nasha/dashboard/:id/partitions',
    trackingActions: ['dashboard', 'partitions'],
  },
];

export function useDashboardTabs(): (DashboardTabType & { isActive: boolean })[] {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  return useMemo(
    () =>
      DASHBOARD_NAV_TABS.map((tab: Omit<DashboardTabType, 'isActive'>) => {
        const resolvedTo = tab.to.replace(':id', id ?? '');
        return {
          ...tab,
          to: resolvedTo,
          isActive:
            pathname === resolvedTo ||
            tab.pathMatchers?.some((rx: RegExp) => rx.test(pathname)) ||
            false,
        };
      }),
    [pathname, id],
  );
}
