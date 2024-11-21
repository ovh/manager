import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { applyFilters } from '@ovh-ux/manager-core-api';
import {
  useGetAllL7Rules,
  useL7Rules,
  useDeleteL7Rule,
  useCreateL7Rule,
  useUpdateL7Rule,
  useGetL7Rule,
} from './useL7Rule';
import {
  createL7Rule,
  deleteL7Rule,
  getL7Rule,
  getL7Rules,
  TL7Rule,
  updateL7Rule,
} from '@/api/data/l7Rules';
import { wrapper } from '@/wrapperRenders';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '../data/load-balancer';
import { sortResults, paginateResults } from '@/helpers';

vi.mock('@/api/data/l7Rules', () => ({
  createL7Rule: vi.fn(),
  deleteL7Rule: vi.fn(),
  getL7Rule: vi.fn(),
  getL7Rules: vi.fn(),
  updateL7Rule: vi.fn(),
}));

describe('useGetAllL7Rules', () => {
  it('fetches and returns all L7 rules', async () => {
    const mockRules = [
      {
        id: '1',
        key: 'key1',
        value: 'value1',
        invert: false,
        ruleType: 'type',
        compareType: 'compareType',
        provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
        operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
        search: 'key1 value1 false type compareType active online',
      },
    ] as TL7Rule[];
    vi.mocked(getL7Rules).mockResolvedValueOnce(mockRules);

    const { result } = renderHook(
      () => useGetAllL7Rules('project1', 'policy1', 'region1'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRules);
  });
});

describe('useL7Rules', () => {
  it('returns paginated and sorted L7 rules', async () => {
    const mockRules = [{ id: '1', key: 'key1', value: 'value1' }] as TL7Rule[];
    vi.mocked(getL7Rules).mockResolvedValueOnce(mockRules);
    vi.mocked(applyFilters).mockReturnValue(mockRules);
    vi.mocked(sortResults).mockReturnValue(mockRules);
    vi.mocked(paginateResults).mockReturnValue({
      rows: mockRules,
      pageCount: 1,
      totalRows: 1,
    });

    const { result } = renderHook(
      () =>
        useL7Rules(
          'project1',
          'policy1',
          'region1',
          { pageIndex: 0, pageSize: 10 },
          { id: 'asc', desc: false },
          [],
        ),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.paginatedL7Rules).toEqual({
      rows: mockRules,
      pageCount: 1,
      totalRows: 1,
    });
  });
});

describe('useDeleteL7Rule', () => {
  it('deletes an L7 rule', async () => {
    vi.mocked(deleteL7Rule).mockResolvedValueOnce({});

    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useDeleteL7Rule({
          projectId: 'project1',
          policyId: 'policy1',
          ruleId: 'rule1',
          region: 'region1',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.deleteL7Rule();
    });

    expect(deleteL7Rule).toHaveBeenCalledWith(
      'project1',
      'region1',
      'policy1',
      'rule1',
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useCreateL7Rule', () => {
  it('creates a new L7 rule', async () => {
    const newRule = { id: '1', key: 'key1', value: 'value1' } as TL7Rule;
    vi.mocked(createL7Rule).mockResolvedValueOnce(newRule);

    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useCreateL7Rule({
          projectId: 'project1',
          policyId: 'policy1',
          region: 'region1',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.createL7Rule(newRule);
    });

    expect(createL7Rule).toHaveBeenCalledWith(
      'project1',
      'region1',
      'policy1',
      newRule,
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useUpdateL7Rule', () => {
  it('updates an existing L7 rule', async () => {
    const updatedRule = { id: '1', key: 'key1', value: 'value1' } as TL7Rule;
    vi.mocked(updateL7Rule).mockResolvedValueOnce(updatedRule);

    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdateL7Rule({
          projectId: 'project1',
          policyId: 'policy1',
          region: 'region1',
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.updateL7Rule(updatedRule);
    });

    expect(updateL7Rule).toHaveBeenCalledWith(
      'project1',
      'region1',
      'policy1',
      updatedRule,
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useGetL7Rule', () => {
  it('fetches a single L7 rule', async () => {
    const mockRule = { id: '1', key: 'key1', value: 'value1' } as TL7Rule;
    vi.mocked(getL7Rule).mockResolvedValueOnce(mockRule);

    const { result } = renderHook(
      () => useGetL7Rule('project1', 'policy1', 'region1', 'rule1'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRule);
  });
});
