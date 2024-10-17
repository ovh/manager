import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { applyFilters } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import {
  useGetAllL7Policies,
  useL7Policies,
  useGetPolicy,
  useDeletePolicy,
  useCreatePolicy,
  getAttribute,
  useUpdatePolicy,
  setSearchPolicy,
} from './useL7Policy';
import {
  getL7Policies,
  getPolicy,
  deletePolicy,
  createPolicy,
  updatePolicy,
  TL7Policy,
} from '@/api/data/l7Policies';
import { wrapper } from '@/wrapperRenders';
import * as useL7PolicyModule from './useL7Policy';
import { sortResults, paginateResults } from '@/helpers';
import { ACTIONS } from '@/constants';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '../data/load-balancer';

vi.mock('@/api/data/l7Policies');

describe('useL7Policy hooks', () => {
  const projectId = 'test-project';
  const listenerId = 'test-listener';
  const region = 'test-region';
  const policyId = 'test-policy';
  const pagination: PaginationState = { pageIndex: 0, pageSize: 10 };
  const sorting: ColumnSort = { id: 'position', desc: false };
  const filters = [];

  it('should fetch all L7 policies', async () => {
    vi.mocked(getL7Policies).mockResolvedValue([]);
    const { result } = renderHook(
      () => useGetAllL7Policies(projectId, listenerId, region),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(getL7Policies).toHaveBeenCalledWith(projectId, listenerId, region);
  });

  it('should fetch a single L7 policy', async () => {
    const policy = { id: policyId } as TL7Policy;
    vi.mocked(getPolicy).mockResolvedValue(policy);
    const { result } = renderHook(
      () => useGetPolicy(projectId, policyId, region),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(policy);
    expect(getPolicy).toHaveBeenCalledWith(projectId, region, policyId);
  });

  it('should delete a policy', async () => {
    const onError = vi.fn();
    const onSuccess = vi.fn();
    vi.mocked(deletePolicy).mockResolvedValue({});
    const { result } = renderHook(
      () =>
        useDeletePolicy({
          projectId,
          policyId,
          region,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.deletePolicy();
    });

    expect(deletePolicy).toHaveBeenCalledWith(projectId, region, policyId);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should create a policy', async () => {
    const newPolicy = { id: 'new-policy' } as TL7Policy;
    const onError = vi.fn();
    const onSuccess = vi.fn();
    (createPolicy as jest.Mock).mockResolvedValue(newPolicy);
    const { result } = renderHook(
      () =>
        useCreatePolicy({
          projectId,
          listenerId,
          region,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.createPolicy(newPolicy);
    });

    expect(createPolicy).toHaveBeenCalledWith(
      projectId,
      region,
      listenerId,
      newPolicy,
    );
    expect(onSuccess).toHaveBeenCalledWith(newPolicy);
  });

  it('should update a policy', async () => {
    const updatedPolicy = { id: policyId } as TL7Policy;
    const onError = vi.fn();
    const onSuccess = vi.fn();
    vi.mocked(updatePolicy).mockResolvedValue(updatedPolicy);
    const { result } = renderHook(
      () =>
        useUpdatePolicy({
          projectId,
          region,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.updatePolicy(updatedPolicy);
    });

    expect(updatePolicy).toHaveBeenCalledWith(projectId, region, updatedPolicy);
    expect(onSuccess).toHaveBeenCalledWith(updatedPolicy);
  });

  it('should handle pagination and sorting', async () => {
    const mockL7Policies = [
      {
        id: 'id',
        position: 1,
        name: 'policy',
      },
    ] as TL7Policy[];
    vi.mocked(applyFilters).mockReturnValue(mockL7Policies);
    vi.mocked(sortResults).mockReturnValue(mockL7Policies);
    vi.mocked(paginateResults).mockReturnValue({
      rows: mockL7Policies,
      pageCount: 1,
      totalRows: 1,
    });
    vi.spyOn(useL7PolicyModule, 'useGetAllL7Policies').mockResolvedValue({
      data: [{ position: 1 }],
    } as UseQueryResult<TL7Policy[]>);
    const { result } = renderHook(
      () =>
        useL7Policies(
          projectId,
          listenerId,
          region,
          pagination,
          sorting,
          filters,
        ),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.paginatedL7Policies).toEqual({
      rows: mockL7Policies,
      totalRows: 1,
      pageCount: 1,
    });
  });

  it('should handle pagination and default sorting', async () => {
    const mockL7Policies = [
      {
        id: 'id',
        position: 1,
        name: 'policy',
      },
    ] as TL7Policy[];
    vi.mocked(applyFilters).mockReturnValue(mockL7Policies);
    vi.mocked(sortResults).mockReturnValue(mockL7Policies);
    vi.mocked(paginateResults).mockReturnValue({
      rows: mockL7Policies,
      pageCount: 1,
      totalRows: 1,
    });
    vi.spyOn(useL7PolicyModule, 'useGetAllL7Policies').mockResolvedValue({
      data: [{ position: 1 }],
    } as UseQueryResult<TL7Policy[]>);
    const { result } = renderHook(
      () =>
        useL7Policies(projectId, listenerId, region, pagination, null, filters),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.paginatedL7Policies).toEqual({
      rows: mockL7Policies,
      totalRows: 1,
      pageCount: 1,
    });
  });
});

describe('getAttribute', () => {
  it('should return redirectUrl for REDIRECT_TO_URL action', () => {
    const policy = {
      action: ACTIONS.REDIRECT_TO_URL,
      redirectUrl: 'http://example.com',
    } as TL7Policy;
    const result = getAttribute(policy);
    expect(result).toBe('http://example.com');
  });

  it('should return redirectPrefix for REDIRECT_PREFIX action', () => {
    const policy = {
      action: ACTIONS.REDIRECT_PREFIX,
      redirectPrefix: '/prefix',
    } as TL7Policy;
    const result = getAttribute(policy);
    expect(result).toBe('/prefix');
  });

  it('should return redirectPoolId for REDIRECT_TO_POOL action', () => {
    const policy = {
      action: ACTIONS.REDIRECT_TO_POOL,
      redirectPoolId: 'pool-id',
    } as TL7Policy;
    const result = getAttribute(policy);
    expect(result).toBe('pool-id');
  });

  it('should return "-" for unknown action', () => {
    const policy = { action: 'UNKNOWN_ACTION' } as TL7Policy;
    const result = getAttribute(policy);
    expect(result).toBe('-');
  });
});
describe('setSearchPolicy', () => {
  it('should set search attribute correctly for REDIRECT_TO_URL action', () => {
    const policies = [
      {
        id: '1',
        action: ACTIONS.REDIRECT_TO_URL,
        redirectUrl: 'http://example.com',
        position: 1,
        name: 'policy1',
        redirectHttpCode: 301,
        redirectPrefix: '/prefix',
        redirectPoolId: 'pool-id',
        provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
        operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
      },
    ] as TL7Policy[];
    const result = setSearchPolicy(policies);
    expect(result[0].search).toContain(
      '1 policy1 Redirect to URL http://example.com 301 active online http://example.com /prefix pool-id',
    );
  });

  it('should set search attribute correctly for REDIRECT_PREFIX action', () => {
    const policies = [
      {
        id: '2',
        action: ACTIONS.REDIRECT_PREFIX,
        redirectPrefix: '/prefix',
        position: 2,
        name: 'policy2',
        redirectHttpCode: 302,
        redirectUrl: 'http://example.com',
        redirectPoolId: 'pool-id',
        provisioningStatus: LoadBalancerProvisioningStatusEnum.UPDATING,
        operatingStatus: LoadBalancerOperatingStatusEnum.OFFLINE,
      },
    ] as TL7Policy[];
    const result = setSearchPolicy(policies);
    expect(result[0].search).toContain(
      '2 policy2 Redirect Prefix /prefix 302 updating offline http://example.com /prefix pool-id',
    );
  });

  it('should set search attribute correctly for REDIRECT_TO_POOL action', () => {
    const policies = [
      {
        id: '3',
        action: ACTIONS.REDIRECT_TO_POOL,
        redirectPoolId: 'pool-id',
        position: 3,
        name: 'policy3',
        redirectHttpCode: 303,
        redirectPrefix: '/prefix',
        redirectUrl: 'http://example.com',
        provisioningStatus: LoadBalancerProvisioningStatusEnum.ERROR,
        operatingStatus: LoadBalancerOperatingStatusEnum.DEGRADED,
      },
    ] as TL7Policy[];
    const result = setSearchPolicy(policies);
    expect(result[0].search).toContain(
      '3 policy3 Redirect to Pool pool-id 303 error degraded http://example.com /prefix pool-id',
    );
  });
});
