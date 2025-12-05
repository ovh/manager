import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks } from '@/data/__mocks__';
import { getWebHostingWebsiteDomain } from '@/data/api/webHosting';
import { wrapper } from '@/utils/test.provider';

import { useWebHostingWebsiteDomain } from '../webHostingWebsiteDomain';

describe('useWebHostingWebsiteDomain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting websites domains list', async () => {
    const { result } = renderHook(() => useWebHostingWebsiteDomain('test', '1'), {
      wrapper,
    });

    expect(result.current.isSuccess).toBe(false);

    await act(async () => {
      await result.current.refetch();
    });

    expect(getWebHostingWebsiteDomain).toHaveBeenCalledWith('test', '1');

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 3000 },
    );

    expect(result.current.data).toEqual(WebHostingWebsiteDomainMocks);
  });
});
