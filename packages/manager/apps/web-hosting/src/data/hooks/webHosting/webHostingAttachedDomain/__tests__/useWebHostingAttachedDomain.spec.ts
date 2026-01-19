import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import { deleteAttachedDomains } from '@/data/api/webHosting';
import { wrapper } from '@/utils/test.provider';

import {
  useDeleteAttachedDomains,
  useWebHostingAttachedDomain,
} from '../useWebHostingAttachedDomain';

const onSuccess = vi.fn();
const onError = vi.fn();

describe('useWebHostingAttachedDomain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting attached domain list', async () => {
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
    (deleteAttachedDomains as jest.Mock).mockResolvedValueOnce([
      { status: 'fulfilled', value: {} },
    ]);

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
      expect(deleteAttachedDomains).toHaveBeenCalledWith('serviceName', ['domain1'], false);

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
