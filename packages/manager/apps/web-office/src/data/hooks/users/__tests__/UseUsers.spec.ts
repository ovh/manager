import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import {
  licensesMock,
  licensesPrepaidExpandedMock,
  licensesPrepaidMock,
} from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import { useUsers } from '@/data/hooks/users/useUsers';
import { wrapper } from '@/utils/Test.provider';

describe('useUsers', () => {
  it('should return users list if office licence', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });
    const { result } = renderHook(() => useUsers(), {
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
    const { result } = renderHook(() => useUsers(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([licensesPrepaidExpandedMock[0]]);
  });
});
