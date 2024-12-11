import { vi, describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { parentTenantMock, licensesMock } from '@/api/_mock_';
import { useOfficeParentTenant } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

const useParamsMock = vi.hoisted(() => ({
  useParams: vi.fn(),
}));

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: useParamsMock.useParams,
  };
});

describe('useOfficeParentTenant', () => {
  it('should return the detail of one parentTenant', async () => {
    useParamsMock.useParams.mockReturnValue({
      serviceName: parentTenantMock.serviceName,
    });
    const { result } = renderHook(() => useOfficeParentTenant(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(parentTenantMock);
  });
});
