import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import { wrapper } from '@/utils/test.provider';
import { deleteMock } from '@/utils/test.setup';

import {
  useDeleteAttachedDomains,
  useWebHostingAttachedDomain,
} from './useWebHostingAttachedDomain';

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useWebHostingAttachedDomain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting attached domain list ', async () => {
    const { result } = renderHook(() => useWebHostingAttachedDomain(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(websitesMocks);
  });
});

describe('useDeleteAttachedDomains', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delete attached domain', async () => {
    const { result } = renderHook(
      () => useDeleteAttachedDomains('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domains: ['domain1'],
        bypassDNSConfiguration: false,
      }),
    );

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(
        `/hosting/web/serviceName/attachedDomain/domain1?bypassDNSConfiguration=false`,
      );

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
