import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { licensesMock, licensesPrepaidMock } from '@/api/_mock_';
import { useOfficeServiceType } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOfficeServiceType', () => {
  it('should return payAsYouGo if office licence', async () => {
    const { result } = renderHook(
      () => useOfficeServiceType(licensesMock[0].serviceName),
      {
        wrapper,
      },
    );

    expect(result.current).toEqual('payAsYouGo');
  });

  it('should return prepaid if office prepaid licence', async () => {
    const { result } = renderHook(
      () => useOfficeServiceType(licensesPrepaidMock[0]),
      {
        wrapper,
      },
    );

    expect(result.current).toEqual('prepaid');
  });
});
