import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { licensesMock } from '@/data/api/__mocks__/license';
import { useLicenseDetail } from '@/data/hooks/license-details/useLicenseDetails';
import { wrapper } from '@/utils/Test.provider';

describe('useLicenseDetail', () => {
  it('should return the detail of one licence', async () => {
    const { result } = renderHook(() => useLicenseDetail(licensesMock[0].serviceName), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(licensesMock[0]);
  });
});
