import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, organizationDetailMock } from '@/api/_mock_';
import { useOrganization } from '../useOrganization';
import { wrapper } from '@/utils/test.provider';

const useLocationMock: {
  pathname: string;
  search: string;
  hash: string;
  state: string | null;
  key: string;
} = {
  pathname: '/00000000-0000-0000-0000-000000000001',
  search: '?organizationId=1903b491-4d10-4000-8b70-f474d1abe601',
  hash: '',
  state: null,
  key: 'naq3ecco',
};

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/organization/api', () => {
  const apiOrganizationDetail = vi.fn(() =>
    Promise.resolve(organizationDetailMock),
  );
  return {
    getZimbraPlatformOrganizationDetails: apiOrganizationDetail,
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useLocation: () => useLocationMock,
  };
});

describe('useOrganization', () => {
  it('should return detail of organization in params url', async () => {
    const { result } = renderHook(() => useOrganization(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(organizationDetailMock);
  });
});
