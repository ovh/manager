import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DashboardTabType } from '@/types/Dashboard.type';

import { useTenantDashboardTabs } from './useTenantDashboardTabs';

const { useLocationMock, useParamsMock, tabsWithActiveTabOrDefaultMock } = vi.hoisted(() => ({
  useLocationMock: vi.fn().mockImplementation(() => ({ pathname: '/services/dashboard/123' })),
  useParamsMock: vi.fn().mockImplementation(() => ({ id: '123' })),
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

describe('useTenantDashboardTabs', () => {
  const testCases = [
    {
      description: 'maps tabs with general information active',
      tenantId: '123',
      pathname: '/services/dashboard/123',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/services/dashboard/123',
          isDefault: true,
          isActive: true,
        },
        {
          name: 'agents',
          title: 'translated_agents',
          to: '/services/dashboard/123/agents',
          isActive: false,
        },
      ],
    },
    {
      description: 'maps tabs with agent active via pathname match',
      tenantId: '456',
      pathname: '/services/dashboard/456/agents',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/services/dashboard/456',
          isDefault: true,
          isActive: false,
        },
        {
          name: 'agents',
          title: 'translated_agents',
          to: '/services/dashboard/456/agents',
          isActive: true,
        },
      ],
    },
    {
      description: 'maps tabs with agent active via pathMatcher',
      tenantId: '789',
      pathname: '/services/dashboard/789/agents/agent-123',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/services/dashboard/789',
          isDefault: true,
          isActive: false,
        },
        {
          name: 'agents',
          title: 'translated_agents',
          to: '/services/dashboard/789/agents',
          isActive: true,
        },
      ],
    },
    {
      description: 'maps tabs with no active tab when pathname does not match',
      tenantId: '',
      pathname: '/different/path',
      expectedTabs: [
        {
          name: 'generalInformations',
          title: 'translated_general_information',
          to: '/services/dashboard/',
          isDefault: true,
          isActive: false,
        },
        {
          name: 'agents',
          title: 'translated_agents',
          to: '/services/dashboard//agents',
          isActive: false,
        },
      ],
    },
  ];

  it.each(testCases)('$description', ({ tenantId, pathname, expectedTabs }) => {
    // Arrange
    useParamsMock.mockReturnValue({ tenantId });
    useLocationMock.mockReturnValue({ pathname });

    // Act
    const { result } = renderHook(() => useTenantDashboardTabs());

    // Assert
    expect(result.current).toEqual(expectedTabs);
    expect(tabsWithActiveTabOrDefaultMock).toHaveBeenCalledWith(expectedTabs);
  });
});
