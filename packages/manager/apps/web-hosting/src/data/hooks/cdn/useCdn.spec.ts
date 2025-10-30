import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cdnOptionMock, serviceNameCdnMock } from '@/data/__mocks__/cdn';
import { CdnOptionType, PatternType } from '@/data/types/product/cdn';
import { wrapper } from '@/utils/test.provider';

import {
  useCreateCdnOption,
  useDeleteCdnOption,
  useGetCdnOption,
  useGetServiceNameCdn,
  useUpdateCdnOption,
} from './useCdn';

const { mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockPost: vi.fn().mockResolvedValue({ data: {} }),
  mockPut: vi.fn().mockResolvedValue({ data: {} }),
  mockDelete: vi.fn().mockResolvedValue({ data: {} }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  },
}));

const onSuccess = vi.fn();
const onError = vi.fn();

it('useGetServiceNameCdn: should return webhosting cdn ', async () => {
  const { result } = renderHook(() => useGetServiceNameCdn('serviceName'), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  expect(result.current.data).toEqual(serviceNameCdnMock);
});

it('useGetCdnOption: should return webhosting cdn options ', async () => {
  const { result } = renderHook(() => useGetCdnOption('serviceName', 'domain'), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  expect(result.current.data).toEqual(cdnOptionMock);
});

describe('useCreateCdnOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create cdn cache rule option', async () => {
    const { result } = renderHook(
      () => useCreateCdnOption('serviceName', 'domainId', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        cdnOption: {
          config: {
            patternType: PatternType.EXTENSION,
            priority: 1,
            ttl: 180,
          },
          enabled: false,
          pattern: 'jpg',
          type: CdnOptionType.CACHE_RULE,
          name: 'test',
        },
      }),
    );

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/cdn/domain/domainId/option', {
        type: CdnOptionType.CACHE_RULE,
        name: 'test',
        pattern: 'jpg',
        enabled: false,
        config: { ttl: 180, priority: 1, patternType: PatternType.EXTENSION },
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('useUpdateCdnOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('update cdn cache rule option', async () => {
    const { result } = renderHook(
      () => useUpdateCdnOption('serviceName', 'domainId', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        option: 'test',
        cdnOption: {
          config: {
            patternType: PatternType.EXTENSION,
            priority: 1,
            ttl: 180,
          },
          enabled: false,
          pattern: 'jpg',
          type: CdnOptionType.CACHE_RULE,
          name: 'test',
        },
      }),
    );

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith(
        '/hosting/web/serviceName/cdn/domain/domainId/option/test',
        {
          enabled: false,
          type: CdnOptionType.CACHE_RULE,
          config: { ttl: 180, priority: 1, patternType: PatternType.EXTENSION },
          pattern: 'jpg',
          name: 'test',
        },
      );

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('useDeleteCdnOption', () => {
  it('should call delete with the correct URL', async () => {
    const { result } = renderHook(
      () => useDeleteCdnOption('serviceName', 'domainId', onSuccess, onError),
      {
        wrapper,
      },
    );
    act(() => result.current.mutate('optionId'));
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(
        `/hosting/web/serviceName/cdn/domain/domainId/option/optionId`,
      );
    });
  });
});
