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
import { useUserDetail } from '@/data/hooks/user-detail/useUserDetail';
import { wrapper } from '@/utils/Test.provider';

describe('useUsers', () => {
  it('should return users list if office licence', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });
    const { result } = renderHook(() => useUserDetail(usersMock[0].activationEmail), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(usersMock[0]);
  });

  it('should return users list if office prepaid licence', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesPrepaidMock[0],
    });
    const { result } = renderHook(
      () =>
        useUserDetail(
          licensesPrepaidExpandedMock[0].activationEmail,
          licensesPrepaidExpandedMock[0].serviceName,
        ),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(licensesPrepaidExpandedMock[0]);
  });
});
