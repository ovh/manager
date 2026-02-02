import '@/common/setupTests';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import { useGetServiceInformation } from './query';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { getServiceInformation } from '@/common/data/api/common.api';
import { serviceInfoAuto } from '@/domain/__mocks__/serviceInfo';

vi.mock('@/common/data/api/common.api');

describe('useGetServiceInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return service information when query is successful', async () => {
    vi.mocked(getServiceInformation).mockResolvedValue(serviceInfoAuto);

    const { result } = renderHook(
      () =>
        useGetServiceInformation(
          'test-key',
          'example.com',
          ServiceRoutes.Domain,
        ),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isServiceInfoLoading).toBe(false);
    });

    expect(result.current.serviceInfo).toEqual(serviceInfoAuto);
    expect(getServiceInformation).toHaveBeenCalledWith(
      'example.com',
      ServiceRoutes.Domain,
    );
  });

  it('should set isServiceInfoLoading to true while fetching', () => {
    vi.mocked(getServiceInformation).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(serviceInfoAuto), 100);
        }),
    );

    const { result } = renderHook(
      () =>
        useGetServiceInformation(
          'test-key',
          'example.com',
          ServiceRoutes.Domain,
        ),
      { wrapper },
    );

    expect(result.current.isServiceInfoLoading).toBe(true);
  });

  it('should handle AllDom service route', async () => {
    vi.mocked(getServiceInformation).mockResolvedValue(serviceInfoAuto);

    const { result } = renderHook(
      () =>
        useGetServiceInformation(
          'alldom-key',
          'alldom-example.com',
          ServiceRoutes.AllDom,
        ),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isServiceInfoLoading).toBe(false);
    });

    expect(result.current.serviceInfo).toEqual(serviceInfoAuto);
    expect(getServiceInformation).toHaveBeenCalledWith(
      'alldom-example.com',
      ServiceRoutes.AllDom,
    );
  });

  it('should return undefined serviceInfo when query fails', async () => {
    vi.mocked(getServiceInformation).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(
      () =>
        useGetServiceInformation(
          'error-key',
          'error-example.com',
          ServiceRoutes.Domain,
        ),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isServiceInfoLoading).toBe(false);
    });

    expect(result.current.serviceInfo).toBeUndefined();
  });

  it('should use correct query key', async () => {
    vi.mocked(getServiceInformation).mockResolvedValue(serviceInfoAuto);

    const key = 'custom-key';
    const serviceName = 'test-domain.com';

    renderHook(
      () => useGetServiceInformation(key, serviceName, ServiceRoutes.Domain),
      { wrapper },
    );

    await waitFor(() => {
      expect(getServiceInformation).toHaveBeenCalled();
    });

    // The query key should be [key, 'service', serviceName]
    expect(getServiceInformation).toHaveBeenCalledWith(
      serviceName,
      ServiceRoutes.Domain,
    );
  });
});
