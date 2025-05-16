import { describe, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { websitesMocks } from '@/data/__mocks__';
import { useWebHostingAttachedDomain } from './useWebHostingAttachedDomain';
import { wrapper } from '@/utils/test.provider';

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
