import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDashboardTabs } from './useDashboardTabs';

// --- Mock react-router-dom ---
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/general-information-tile/123' }),
  useParams: () => ({ id: '123' }),
}));

describe('useVaultDashboardTabs', () => {
  it.skip('resolves the :id param in tab "to" field', () => {
    const { result } = renderHook(() => useDashboardTabs());
    const generalTab = result.current.find((t) => t.name === 'general-information');
    expect(generalTab).toBeDefined();
    expect(generalTab!.to).toBe('/general-information-tile/123');
  });
});
