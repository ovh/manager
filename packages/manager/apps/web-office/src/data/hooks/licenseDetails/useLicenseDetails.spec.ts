import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { licensesMock } from '@/data/api/_mock_';
import { useLicenseDetail } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useLicenseDetail', () => {
  it('should return the detail of one licence', async () => {
    const { result } = renderHook(
      () => useLicenseDetail(licensesMock[0].serviceName),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(licensesMock[0]);
  });
});
