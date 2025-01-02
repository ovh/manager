import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { licensesMock } from '@/api/_mock_';
import { useOfficeLicenses } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOfficeLicenses', () => {
  it('should return licenses list (office and oaffice prepaid)', async () => {
    const { result } = renderHook(() => useOfficeLicenses(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(licensesMock);
  });
});
