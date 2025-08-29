import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DashboardTabType } from '@/types/Dashboard.type';

import { useDashboardTabs } from './useDashboardTabs';

// --- Mock react-router-dom ---
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/general-information/123' }),
  useParams: () => ({ id: '123' }),
}));

// --- Mock routes constants ---
vi.mock('@/routes/Routes.constants', () => {
  const tabs: DashboardTabType[] = [
    {
      name: 'general-information',
      title: 'dashboard:general-information',
      to: '/general-information/:id',
      pathMatchers: [/^\/general-information\/[^/]+$/],
      trackingActions: ['click::general-information-tab'],
    },
    {
      name: 'help',
      title: 'dashboard:help',
      to: '/help',
      pathMatchers: [/\/help$/],
      trackingActions: ['click::help-tab'],
    },
  ];
  return { DASHBOARD_NAV_TABS: tabs };
});

describe('useDashboardTabs', () => {
  it('resolves the :id param in tab "to" field', () => {
    const { result } = renderHook(() => useDashboardTabs());
    const generalTab = result.current.find((t) => t.name === 'general-information');
    expect(generalTab).toBeDefined();
    expect(generalTab!.to).toBe('/general-information/123');
  });
});
