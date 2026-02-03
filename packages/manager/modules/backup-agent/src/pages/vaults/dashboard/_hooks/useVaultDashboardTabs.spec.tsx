import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DashboardTabType } from '@/types/Dashboard.type';

import { useVaultDashboardTabs } from './useVaultDashboardTabs';

const { useLocationMock, useParamsMock, tabsWithActiveTabOrDefaultMock } = vi.hoisted(() => ({
  useLocationMock: vi.fn().mockImplementation(() => ({ pathname: '/vaults/123' })),
  useParamsMock: vi.fn().mockImplementation(() => ({ vaultId: '123' })),
  tabsWithActiveTabOrDefaultMock: vi.fn().mockImplementation((tabs: DashboardTabType[]) => tabs),
}));

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: vi
    .fn()
    .mockImplementation(() => ({ t: (key: string) => `translated_${key.split(':')[1]}` })),
}));

// --- Mock react-router-dom ---
vi.mock('react-router-dom', () => ({
  useLocation: useLocationMock,
  useParams: useParamsMock,
}));

vi.mock('@/utils/tabsWithActiveTabOrDefault', () => ({
  tabsWithActiveTabOrDefault: tabsWithActiveTabOrDefaultMock,
}));

describe('useVaultDashboardTabs', () => {
  const testCases = [
    {
      description: 'maps tabs with general information active',
      vaultId: '123',
      pathname: '/vaults/123',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/vaults/123',
          isDefault: true,
          isActive: true,
        },
        {
          name: 'buckets',
          title: 'translated_buckets',
          to: '/vaults/123/buckets',
          isActive: false,
        },
      ],
    },
    {
      description: 'maps tabs with buckets active via pathname match',
      vaultId: '456',
      pathname: '/vaults/456/buckets',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/vaults/456',
          isDefault: true,
          isActive: false,
        },
        {
          name: 'buckets',
          title: 'translated_buckets',
          to: '/vaults/456/buckets',
          isActive: true,
        },
      ],
    },
    {
      description: 'maps tabs with buckets active via pathMatcher',
      vaultId: '789',
      pathname: '/vaults/789/buckets/agent-123',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/vaults/789',
          isDefault: true,
          isActive: false,
        },
        {
          name: 'buckets',
          title: 'translated_buckets',
          to: '/vaults/789/buckets',
          isActive: true,
        },
      ],
    },
    {
      description: 'maps tabs with no active tab when pathname does not match',
      vaultId: '',
      pathname: '/different/path',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/vaults/',
          isDefault: true,
          isActive: false,
        },
        {
          name: 'buckets',
          title: 'translated_buckets',
          to: '/vaults//buckets',
          isActive: false,
        },
      ],
    },
  ];

  it.each(testCases)('$description', ({ vaultId, pathname, expectedTabs }) => {
    // Arrange
    useParamsMock.mockReturnValue({ vaultId });
    useLocationMock.mockReturnValue({ pathname });

    // Act
    const { result } = renderHook(() => useVaultDashboardTabs());

    // Assert
    expect(result.current).toEqual(expectedTabs);
    expect(tabsWithActiveTabOrDefaultMock).toHaveBeenCalledWith(expectedTabs);
  });
});
