import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { websitesMocks } from '@/api/_mock_';
import { useWebHostingAttachedDomain } from '@/hooks';
import { wrapper } from '@/test.provider';

describe('useWebHostingAttachedDomain', () => {
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
