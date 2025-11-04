import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  WebHostingWebsiteV6Mock,
  domainInformationMock,
  domainZoneMock,
  serviceInfosMock,
  webHostingMock,
} from '@/data/__mocks__';
import {
  useCreateAttachedDomainService,
  useCreateAttachedDomainsService,
  useGetDomainService,
  useGetDomainZone,
  useGetHostingService,
  useGetHostingServiceWebsite,
  useGetServiceInfos,
  useUpdateHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { HostingDomainStatus } from '@/data/types/product/webHosting';
import { wrapper } from '@/utils/test.provider';

const { mockPut, mockPost } = vi.hoisted(() => ({
  mockPut: vi.fn().mockResolvedValue({ data: {} }),
  mockPost: vi.fn().mockResolvedValue({ data: {} }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    put: mockPut,
    post: mockPost,
  },
}));
const onSuccess = vi.fn();
const onError = vi.fn();

describe('useWebHostingDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('update hosting service information', async () => {
    const { result } = renderHook(
      () => useUpdateHostingService('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        displayName: 'displayName',
      }),
    );

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/hosting/web/serviceName', {
        displayName: 'displayName',
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('useGetHostingService: should return webhosting service', async () => {
    const { result } = renderHook(() => useGetHostingService('serviceName'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(webHostingMock);
  });

  it('useGetDomainZone: should return domain zone', async () => {
    const { result } = renderHook(() => useGetDomainZone(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(domainZoneMock);
  });

  it('useGetServiceInfos: should return webhosting service', async () => {
    const { result } = renderHook(() => useGetServiceInfos('serviceName'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(serviceInfosMock);
  });

  it('useGetDomainService: should return webhosting service', async () => {
    const { result } = renderHook(() => useGetDomainService('serviceName'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(domainInformationMock);
  });
  it('useGetHostingServiceWebsite: should return webhosting website list ', async () => {
    const { result } = renderHook(() => useGetHostingServiceWebsite('serviceName', 'path'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(WebHostingWebsiteV6Mock);
  });

  it('create attached domain', async () => {
    const { result } = renderHook(
      () => useCreateAttachedDomainService('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domain: 'domain',
        cdn: HostingDomainStatus.ACTIVE,
        firewall: HostingDomainStatus.ACTIVE,
        ownLog: 'ownLog',
        path: 'path',
        runtimeId: 456,
        ssl: true,
        bypassDNSConfiguration: true,
        ipLocation: null,
      }),
    );

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain', {
        domain: 'domain',
        cdn: HostingDomainStatus.ACTIVE,
        firewall: HostingDomainStatus.ACTIVE,
        ownLog: 'ownLog',
        path: 'path',
        runtimeId: 456,
        ssl: true,
        bypassDNSConfiguration: true,
        ipLocation: null,
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('create attached domain with www', async () => {
    const { result } = renderHook(
      () => useCreateAttachedDomainsService('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domain: 'domain',
        cdn: HostingDomainStatus.ACTIVE,
        firewall: HostingDomainStatus.ACTIVE,
        ownLog: 'ownLog',
        path: 'path',
        runtimeId: 456,
        ssl: true,
        bypassDNSConfiguration: true,
        ipLocation: null,
        wwwNeeded: true,
      }),
    );

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain', {
        domain: 'domain',
        cdn: HostingDomainStatus.ACTIVE,
        firewall: HostingDomainStatus.ACTIVE,
        ownLog: 'ownLog',
        path: 'path',
        runtimeId: 456,
        ssl: true,
        bypassDNSConfiguration: true,
        ipLocation: null,
      });

      expect(mockPost).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain', {
        domain: 'www.domain',
        cdn: HostingDomainStatus.ACTIVE,
        firewall: HostingDomainStatus.ACTIVE,
        ownLog: 'ownLog',
        path: 'path',
        runtimeId: 456,
        ssl: true,
        bypassDNSConfiguration: true,
        ipLocation: null,
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
