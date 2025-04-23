import { vi, describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import {
  parentTenantMock,
  licensesMock,
  licensesPrepaidMock,
} from '@/data/api/__mocks__';
import { useParentTenant } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useParentTenant', () => {
  it('should return the detail of parentTenant if prepaid', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesPrepaidMock[0],
    });

    const { result } = renderHook(() => useParentTenant(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(parentTenantMock);
  });

  it('should return the detail of current license if payAsYouGo', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });
    const { result } = renderHook(() => useParentTenant(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(licensesMock[0]);
  });
});
