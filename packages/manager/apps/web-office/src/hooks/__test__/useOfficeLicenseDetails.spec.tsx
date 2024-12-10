import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { licensesMock } from '@/api/_mock_';
import { useOfficeLicenseDetail } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOfficeLicenseDetail', () => {
  it('should return the detail of one licence', async () => {
    const { result } = renderHook(
      () => useOfficeLicenseDetail(licensesMock[0].serviceName),
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
