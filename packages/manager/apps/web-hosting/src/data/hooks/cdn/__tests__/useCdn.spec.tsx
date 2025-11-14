import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { attachedDomainDigStatusMock } from '@/data/__mocks__';
import { cdnOptionMock, cdnPropertiesMock, serviceNameCdnMock } from '@/data/__mocks__/cdn';
import { wrapper } from '@/utils/test.provider';

import { useGetCDNProperties, useGetCdnOption, useGetServiceNameCdn } from '../useCdn';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockResolvedValue({ data: attachedDomainDigStatusMock }),
  },
}));

describe('useGetCDNProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting cdn properties', async () => {
    const { result } = renderHook(() => useGetCDNProperties('testServiceName'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(cdnPropertiesMock);
  });
});

it('useGetServiceNameCdn: should return webhosting cdn ', async () => {
  const { result } = renderHook(() => useGetServiceNameCdn('serviceName'), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  expect(result.current.data).toEqual(serviceNameCdnMock);
});

it('useGetCdnOption: should return webhosting cdn options ', async () => {
  const { result } = renderHook(() => useGetCdnOption('serviceName', 'domain'), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  expect(result.current.data).toEqual(cdnOptionMock);
});
