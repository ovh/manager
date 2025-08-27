import { describe, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import { act, renderHook, waitFor } from '@testing-library/react';
import { localSeoMocks } from '@/data/__mocks__';
import { wrapper } from '@/utils/test.provider';
import {
  hostingLocalSeoLogin,
  hostingDeleteLocation,
} from '@/data/api/local-seo';

import {
  useGetHostingLocalSeo,
  useHostingLocalSeoLogin,
  useHostingDeleteLocation,
} from './useWebHostingLocalSeo';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockReturnValue({
      data: localSeoMocks,
      headers: { 'x-pagination-total': '1' },
    }),
  },
}));

vi.mock('@/data/api/local-seo', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/api/local-seo')>();
  return {
    ...actual,
    hostingLocalSeoLogin: vi.fn(),
    hostingDeleteLocation: vi.fn(),
  };
});

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useGetHostingLocalSeo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting visibility pro list ', async () => {
    const { result } = renderHook(() => useGetHostingLocalSeo('servicename'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(localSeoMocks);
    });
  });
});

describe('useHostingLocalSeoLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('local seo login for token', async () => {
    const { result } = renderHook(
      () => useHostingLocalSeoLogin('serviceName'),
      {
        wrapper,
      },
    );
    act(() => result.current.mutate('accountId'));

    await waitFor(() => {
      expect(hostingLocalSeoLogin).toHaveBeenCalledWith(
        'serviceName',
        'accountId',
      );
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
      expect(hostingDeleteLocation).toHaveBeenCalledWith(
        'serviceName',
        'locationId',
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
