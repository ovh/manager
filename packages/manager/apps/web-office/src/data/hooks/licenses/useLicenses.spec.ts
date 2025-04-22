import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { licensesMock } from '@/data/api/_mock_';
import { useLicenses } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useLicenses', () => {
  it('should return licenses list (office and oaffice prepaid)', async () => {
    const { result } = renderHook(() => useLicenses(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(licensesMock);
  });
});
