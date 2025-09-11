import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { licensesMock } from '@/data/api/__mocks__/license';
import { useLicenses } from '@/data/hooks/licenses/useLicenses';
import { wrapper } from '@/utils/Test.provider';

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
