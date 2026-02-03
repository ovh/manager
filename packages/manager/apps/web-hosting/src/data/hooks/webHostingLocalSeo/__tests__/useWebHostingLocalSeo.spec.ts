import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { localSeoMocks } from '@/data/__mocks__';
import { hostingDeleteLocation, hostingLocalSeoLogin } from '@/data/api/local-seo';
import { wrapper } from '@/utils/test.provider';

import { useHostingDeleteLocation, useHostingLocalSeoLogin } from '../useWebHostingLocalSeo';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockReturnValue({
      data: localSeoMocks,
      headers: { 'x-pagination-total': '1' },
    }),
  },
}));

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useHostingLocalSeoLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('local seo login for token', async () => {
    const { result } = renderHook(() => useHostingLocalSeoLogin('serviceName'), {
      wrapper,
    });
    act(() => result.current.mutate('accountId'));

    await waitFor(() => {
      expect(hostingLocalSeoLogin).toHaveBeenCalledWith('serviceName', 'accountId');
    });
  });
});

describe('useHostingDeleteLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('local seo login for token', async () => {
    const { result } = renderHook(
      () => useHostingDeleteLocation('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );
    act(() => result.current.mutate('locationId'));

    await waitFor(() => {
      expect(hostingDeleteLocation).toHaveBeenCalledWith('serviceName', 'locationId');
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
