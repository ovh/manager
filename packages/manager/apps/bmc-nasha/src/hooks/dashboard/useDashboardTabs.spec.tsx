import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DashboardTabType } from '@/types/Dashboard.type';

import { useDashboardTabs } from './useDashboardTabs';

// --- Mock react-router-dom ---
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/bmc-nasha/dashboard/123' }),
  useParams: () => ({ id: '123' }),
}));

describe('useDashboardTabs', () => {
  it('resolves the :id param in tab "to" field', () => {
    const { result } = renderHook(() => useDashboardTabs());
    const generalTab = result.current.find((t) => t.name === 'general-information');
    expect(generalTab).toBeDefined();
    expect(generalTab!.to).toBe('/bmc-nasha/dashboard/123');
  });

  it('marks the correct tab as active based on pathname', () => {
    const { result } = renderHook(() => useDashboardTabs());
    const generalTab = result.current.find((t) => t.name === 'general-information');
    expect(generalTab?.isActive).toBe(true);
  });

  it('returns all configured tabs with resolved parameters', () => {
    const { result } = renderHook(() => useDashboardTabs());
    expect(result.current).toHaveLength(2);
    expect(result.current[0]?.name).toBe('general-information');
    expect(result.current[1]?.name).toBe('partitions');
  });
});
