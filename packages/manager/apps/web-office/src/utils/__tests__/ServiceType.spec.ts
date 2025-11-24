import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { licensesMock, licensesPrepaidMock } from '@/data/api/__mocks__/license';
import { ServiceType } from '@/utils/ServiceType.utils';

describe('useServiceType', () => {
  it('should return payAsYouGo if office licence', () => {
    const { result } = renderHook(() => ServiceType(licensesMock[0].serviceName), {});
    expect(result.current).toEqual('payAsYouGo');
  });

  it('should return prepaid if office prepaid licence', () => {
    const { result } = renderHook(() => ServiceType(licensesPrepaidMock[0]), {});
    expect(result.current).toEqual('prepaid');
  });
});
