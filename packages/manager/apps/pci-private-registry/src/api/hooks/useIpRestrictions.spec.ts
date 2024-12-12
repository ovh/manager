import { renderHook, waitFor, act } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useIpRestrictions, useUpdateIpRestriction } from './useIpRestrictions';
import { wrapper } from '@/wrapperRenders';
import {
  getIpRestrictions,
  updateIpRestriction,
} from '../data/ip-restrictions';
import queryClient from '@/queryClient';

vi.mock('../data/ip-restrictions');
vi.mock('@/queryClient');

const mockHooksSetup = (hook, options) => {
  const { result } = renderHook(() => hook(options), { wrapper });
  return result;
};

const mockDataSetup = (mockFn, mockData) => {
  (mockFn as Mock).mockResolvedValueOnce(mockData);
};

describe('useIpRestrictions Hook Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch IP restrictions successfully', async () => {
    const mockData = [
      { ipBlock: '192.168.0.1/24', description: 'allow' },
      { ipBlock: '10.0.0.0/8', description: 'deny' },
    ];
    mockDataSetup(getIpRestrictions, mockData);

    const result = mockHooksSetup(useIpRestrictions, {
      projectId: 'project-id',
      registryId: 'registry-id',
      resources: ['management', 'registry'],
    });

    await waitFor(() => expect(result.current.data).toEqual(mockData));
    expect(getIpRestrictions).toHaveBeenCalledWith(
      'project-id',
      'registry-id',
      ['management', 'registry'],
    );
  });

  it('should apply a selector to fetched IP restrictions', async () => {
    const mockData = [
      { id: '1', ipBlock: '192.168.0.2/32', description: 'allow' },
      { id: '2', ipBlock: '10.0.0.0/8', description: 'deny' },
    ];
    mockDataSetup(getIpRestrictions, mockData);

    const selectMock = vi.fn((data) =>
      data.filter((item) => item.description === 'allow'),
    );

    const result = mockHooksSetup(useIpRestrictions, {
      projectId: 'project-id',
      registryId: 'registry-id',
      resources: ['management', 'registry'],
      select: selectMock,
    });

    await waitFor(() =>
      expect(result.current.data).toEqual([
        { id: '1', ipBlock: '192.168.0.2/32', description: 'allow' },
      ]),
    );
    expect(selectMock).toHaveBeenCalledWith(mockData);
  });
});

describe('useUpdateIpRestriction Hook Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const testUpdateIpRestriction = async (
    params,
    action,
    mockInvalidate,
    onSuccess,
    onError,
    expectedError = null,
  ) => {
    const result = mockHooksSetup(useUpdateIpRestriction, {
      projectId: 'project-id',
      registryId: 'registry-id',
      onSuccess,
      onError,
    });

    await act(async () => {
      result.current.updateIpRestrictions(params);
    });

    expect(updateIpRestriction).toHaveBeenCalledWith(
      'project-id',
      'registry-id',
      params.cidrToUpdate,
      action,
    );

    if (mockInvalidate) {
      expect(mockInvalidate).toHaveBeenCalledWith({
        queryKey: [
          'project',
          'project-id',
          'registry',
          'registry-id',
          'ipRestrictions',
          ['management', 'registry'],
        ],
      });
    }

    if (expectedError) {
      expect(onError).toHaveBeenCalledWith(expectedError, params, undefined);
    } else {
      expect(onSuccess).toHaveBeenCalled();
    }
  };

  it('should successfully update IP restrictions', async () => {
    const mockInvalidate = vi.fn();
    queryClient.invalidateQueries = mockInvalidate;
    mockDataSetup(updateIpRestriction, null);

    const params = {
      cidrToUpdate: {
        management: [
          { id: '1', ipBlock: '192.168.0.2/24', description: 'allow' },
        ],
      },
      action: 'REPLACE' as const,
    };

    await testUpdateIpRestriction(
      params,
      'REPLACE',
      mockInvalidate,
      vi.fn(),
      vi.fn(),
    );
  });

  it('should call onError when update fails', async () => {
    const error = new Error('Update failed');
    (updateIpRestriction as Mock).mockRejectedValue(error);

    const params = {
      cidrToUpdate: {
        management: [
          { id: '1', ipBlock: '192.168.0.1/24', description: 'allow' },
        ],
      },
      action: 'DELETE' as const,
    };

    await testUpdateIpRestriction(
      params,
      'DELETE',
      null,
      vi.fn(),
      vi.fn(),
      error,
    );
  });
});
