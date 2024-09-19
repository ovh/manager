import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, organizationListMock } from '@/api/_mock_';
import { useOrganizationList } from '../useOrganizationsList';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/organization/api', () => {
  const apiOrganization = vi.fn(() => Promise.resolve(organizationListMock));
  return {
    getZimbraPlatformOrganization: apiOrganization,
  };
});

describe('useOrganizationsList', () => {
  it('should return a list of organization', async () => {
    const { result } = renderHook(() => useOrganizationList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(organizationListMock);
  });
});
