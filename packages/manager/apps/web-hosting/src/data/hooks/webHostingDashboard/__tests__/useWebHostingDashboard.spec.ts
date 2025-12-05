/* eslint-disable max-lines */
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
  useGetAddDomainExisting,
  useGetDeploymentLogs,
  useGetDomainService,
  useGetDomainZone,
  useGetHostingService,
  useGetHostingServiceWebsite,
  useGetHostingWebsiteIds,
  useGetServiceInfos,
  useGetWebsiteDeployments,
  usePostWebsiteDeploy,
  useUpdateAttachedDomainService,
  useUpdateHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { HostingDomainStatus } from '@/data/types/product/webHosting';
import { wrapper } from '@/utils/test.provider';

const {
  mockPut,
  mockPost,
  mockGet,
  mockAapiGet,
  mockFetchHostingWebsiteIds,
  mockFetchWebsiteDeployments,
  mockFetchDeploymentLogs,
  mockPostWebsiteDeploy,
} = vi.hoisted(() => ({
  mockPut: vi.fn().mockResolvedValue({ data: {} }),
  mockPost: vi.fn().mockResolvedValue({ data: {} }),
  mockGet: vi.fn().mockResolvedValue({ data: [] }),
  mockAapiGet: vi.fn().mockResolvedValue({ data: {} }),
  mockFetchHostingWebsiteIds: vi.fn().mockResolvedValue([1, 2, 3]),
  mockFetchWebsiteDeployments: vi.fn().mockResolvedValue([1, 2, 3]),
  mockFetchDeploymentLogs: vi.fn().mockResolvedValue([{ id: 1, message: 'test' }]),
  mockPostWebsiteDeploy: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    put: mockPut,
    post: mockPost,
    get: mockGet,
  },
  aapi: {
    get: mockAapiGet,
  },
}));

vi.mock('@/data/api/git', () => ({
  fetchHostingWebsiteIds: mockFetchHostingWebsiteIds,
  fetchWebsiteDeployments: mockFetchWebsiteDeployments,
  fetchDeploymentLogs: mockFetchDeploymentLogs,
  postWebsiteDeploy: mockPostWebsiteDeploy,
  deleteGitAssociation: vi.fn(),
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

  it('useGetServiceInfos: should be disabled when serviceName is empty', () => {
    const { result } = renderHook(() => useGetServiceInfos(''), {
      wrapper,
    });

    expect(result.current.isFetching).toBeFalsy();
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
  it('useGetHostingServiceWebsite: should return webhosting website list', async () => {
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

  it('useGetHostingWebsiteIds: should return website ids', async () => {
    mockFetchHostingWebsiteIds.mockResolvedValueOnce([1, 2, 3]);
    const { result } = renderHook(() => useGetHostingWebsiteIds('serviceName', 'path'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual([1, 2, 3]);
  });

  it('useGetHostingWebsiteIds: should be disabled when serviceName is empty', () => {
    const { result } = renderHook(() => useGetHostingWebsiteIds(''), {
      wrapper,
    });
    expect(result.current.isFetching).toBe(false);
  });

  it('useGetWebsiteDeployments: should return deployments', async () => {
    mockFetchWebsiteDeployments.mockResolvedValueOnce([1, 2, 3]);
    const { result } = renderHook(() => useGetWebsiteDeployments('serviceName', 123), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual([1, 2, 3]);
  });

  it('useGetWebsiteDeployments: should be disabled when websiteId is undefined', () => {
    const { result } = renderHook(() => useGetWebsiteDeployments('serviceName', undefined), {
      wrapper,
    });
    expect(result.current.isFetching).toBe(false);
  });

  it('useGetDeploymentLogs: should return logs', async () => {
    const logsMock = [{ id: 1, message: 'test' }];
    mockFetchDeploymentLogs.mockResolvedValueOnce(logsMock);
    const { result } = renderHook(() => useGetDeploymentLogs('serviceName', 123, 456), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(logsMock);
  });

  it('useGetDeploymentLogs: should be disabled when websiteId or deploymentId is undefined', () => {
    const { result: result1 } = renderHook(
      () => useGetDeploymentLogs('serviceName', undefined, 456),
      {
        wrapper,
      },
    );
    expect(result1.current.isFetching).toBe(false);

    const { result: result2 } = renderHook(
      () => useGetDeploymentLogs('serviceName', 123, undefined),
      {
        wrapper,
      },
    );
    expect(result2.current.isFetching).toBe(false);
  });

  it('usePostWebsiteDeploy: should trigger deployment successfully', async () => {
    mockPostWebsiteDeploy.mockResolvedValueOnce(undefined);
    const { result } = renderHook(
      () => usePostWebsiteDeploy('serviceName', 123, { onSuccess, onError }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate({ reset: false });
    });

    await waitFor(() => {
      expect(mockPostWebsiteDeploy).toHaveBeenCalledWith('serviceName', 123, false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('usePostWebsiteDeploy: should throw error when serviceName is empty', async () => {
    const { result } = renderHook(() => usePostWebsiteDeploy('', 123, { onSuccess, onError }), {
      wrapper,
    });

    act(() => {
      result.current.mutate({ reset: false });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      const error = onError.mock.calls[0][0] as Error;
      expect(error.message).toBe('serviceName is required to trigger a deployment');
    });
  });

  it('usePostWebsiteDeploy: should throw error when websiteId is undefined', async () => {
    const { result } = renderHook(
      () => usePostWebsiteDeploy('serviceName', undefined, { onSuccess, onError }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate({ reset: false });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      const error = onError.mock.calls[0][0] as Error;
      expect(error.message).toBe('websiteId is required to trigger a deployment');
    });
  });

  it('useGetAddDomainExisting: should return existing domain data', async () => {
    const existingDomainMock = { domains: ['example.com'] };
    mockAapiGet.mockResolvedValueOnce({ data: existingDomainMock });
    const { result } = renderHook(() => useGetAddDomainExisting('serviceName', true, true), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(existingDomainMock);
  });

  it('useGetAddDomainExisting: should be disabled when enabled is false', () => {
    const { result } = renderHook(() => useGetAddDomainExisting('serviceName', true, false), {
      wrapper,
    });
    expect(result.current.isFetching).toBe(false);
  });

  it('useUpdateAttachedDomainService: should update attached domain', async () => {
    mockPut.mockResolvedValueOnce({ data: { domain: 'test.com', cdn: 'ACTIVE' } });
    const { result } = renderHook(
      () => useUpdateAttachedDomainService('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.updateAttachedDomainService({ domain: 'test.com', cdn: 'ACTIVE' });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('useUpdateAttachedDomainService: should call onError when update fails', async () => {
    const error = new Error('Update failed');
    mockPut.mockRejectedValueOnce(error);
    const { result } = renderHook(
      () => useUpdateAttachedDomainService('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.updateAttachedDomainService({ domain: 'test.com', cdn: 'ACTIVE' });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toEqual(error);
    });
  });
});
