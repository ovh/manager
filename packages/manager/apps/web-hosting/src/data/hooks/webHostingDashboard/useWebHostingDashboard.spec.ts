import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  useCreateAttachedDomainService,
  useCreateAttachedDomainsService,
  useGetDomainService,
  useGetDomainZone,
  useGetHostingService,
  useGetServiceInfos,
  useUpdateHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { wrapper } from '@/utils/test.provider';
import {
  domainInformationMock,
  domainZoneMock,
  serviceInfosMock,
  webHostingMock,
} from '@/data/__mocks__';
import { HostingDomainStatus } from '@/data/type';

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
      expect(v6.put).toHaveBeenCalledWith('/hosting/web/serviceName', {
        displayName: 'displayName',
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('useGetHostingService: should return webhosting service ', async () => {
    const { result } = renderHook(() => useGetHostingService('serviceName'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(webHostingMock);
  });

  it('useGetDomainZone: should return domain zone ', async () => {
    const { result } = renderHook(() => useGetDomainZone(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(domainZoneMock);
  });

  it('useGetServiceInfos: should return webhosting service ', async () => {
    const { result } = renderHook(() => useGetServiceInfos('serviceName'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(serviceInfosMock);
  });

  it('useGetDomainService: should return webhosting service ', async () => {
    const { result } = renderHook(() => useGetDomainService('serviceName'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(domainInformationMock);
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
      expect(v6.post).toHaveBeenCalledWith(
        '/hosting/web/serviceName/attachedDomain',
        {
          domain: 'domain',
          cdn: HostingDomainStatus.ACTIVE,
          firewall: HostingDomainStatus.ACTIVE,
          ownLog: 'ownLog',
          path: 'path',
          runtimeId: 456,
          ssl: true,
          bypassDNSConfiguration: true,
          ipLocation: null,
        },
      );

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('create attached domain', async () => {
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
      expect(v6.post).toHaveBeenCalledWith(
        '/hosting/web/serviceName/attachedDomain',
        {
          domain: 'domain',
          cdn: HostingDomainStatus.ACTIVE,
          firewall: HostingDomainStatus.ACTIVE,
          ownLog: 'ownLog',
          path: 'path',
          runtimeId: 456,
          ssl: true,
          bypassDNSConfiguration: true,
          ipLocation: null,
        },
      );

      expect(v6.post).toHaveBeenCalledWith(
        '/hosting/web/serviceName/attachedDomain',
        {
          domain: 'www.domain',
          cdn: HostingDomainStatus.ACTIVE,
          firewall: HostingDomainStatus.ACTIVE,
          ownLog: 'ownLog',
          path: 'path',
          runtimeId: 456,
          ssl: true,
          bypassDNSConfiguration: true,
          ipLocation: null,
        },
      );

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // it('useGetAddDomainExisting: should return webhosting service ', async () => {
  //   const { result } = renderHook(
  //     () => useGetAddDomainExisting('serviceName'),
  //     {
  //       wrapper,
  //     },
  //   );
  //   await waitFor(() => {
  //     expect(result.current.isSuccess).toBe(true);
  //   });
  //   expect(result.current.data).toEqual(webHostingMock);
  // });
});
