import { vi, describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import {
  licensesMock,
  licensesPrepaidMock,
  licensesPrepaidExpandedMock,
  usersMock,
} from '@/api/_mock_';
import { useOfficeUsers } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOfficeUsers', () => {
  it('should return users list if office licence', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });
    const { result } = renderHook(() => useOfficeUsers(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(usersMock);
  });

  it('should return users list if office prepaid licence', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesPrepaidMock[0],
    });
    const { result } = renderHook(() => useOfficeUsers(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([licensesPrepaidExpandedMock[0]]);
  });
});
