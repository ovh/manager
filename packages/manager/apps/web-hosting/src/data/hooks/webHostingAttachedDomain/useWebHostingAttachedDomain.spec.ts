import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import { wrapper } from '@/utils/test.provider';

import { useWebHostingAttachedDomain } from './useWebHostingAttachedDomain';

vi.mock('@ovh-ux/manager-core-api', () => ({
  fetchIcebergV2: vi.fn().mockResolvedValue({
    data: websitesMocks,
    cursorNext: null,
  }),
}));

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
