import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { licensesMock, licensesPrepaidMock } from '@/data/api/__mocks__';
import { useServiceType } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useServiceType', () => {
  it('should return payAsYouGo if office licence', async () => {
    const { result } = renderHook(
      () => useServiceType(licensesMock[0].serviceName),
      {
        wrapper,
      },
    );

    expect(result.current).toEqual('payAsYouGo');
  });

  it('should return prepaid if office prepaid licence', async () => {
    const { result } = renderHook(
      () => useServiceType(licensesPrepaidMock[0]),
      {
        wrapper,
      },
    );

    expect(result.current).toEqual('prepaid');
  });
});
