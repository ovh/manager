import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { WebHostingWebsiteMocks } from '@/data/__mocks__';
import { wrapper } from '@/utils/test.provider';

import { useWebHostingWebsite } from '../useWebHostingWebsite';

describe('useWebHostingAttachedDomain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting websites list ', async () => {
    const { result } = renderHook(() => useWebHostingWebsite('test'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(WebHostingWebsiteMocks);
  });
});
