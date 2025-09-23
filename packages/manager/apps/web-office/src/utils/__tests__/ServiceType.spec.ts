import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { licensesMock, licensesPrepaidMock } from '@/data/api/__mocks__/license';
import { ServiceType } from '@/utils/ServiceType.utils';
import { wrapper } from '@/utils/Test.provider';

describe('useServiceType', () => {
  it('should return payAsYouGo if office licence', () => {
    const { result } = renderHook(() => ServiceType(licensesMock[0].serviceName), {
      wrapper,
    });

    expect(result.current).toEqual('payAsYouGo');
  });

  it('should return prepaid if office prepaid licence', () => {
    const { result } = renderHook(() => ServiceType(licensesPrepaidMock[0]), {
      wrapper,
    });

    expect(result.current).toEqual('prepaid');
  });
});
