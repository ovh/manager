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

describe('useIpRestrictions Hook Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch IP restrictions successfully', async () => {
    const mockData = [
      { ipBlock: '192.168.0.1/24', description: 'allow' },
      { ipBlock: '10.0.0.0/8', description: 'deny' },
    ];
    (getIpRestrictions as Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () =>
        useIpRestrictions('project-id', 'registry-id', [
          'management',
          'registry',
        ]),
      { wrapper },
    );

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
    (vi.mocked(getIpRestrictions) as Mock).mockResolvedValueOnce(mockData);

    const selectMock = vi.fn((data) =>
      data.filter((item) => item.description === 'allow'),
    );

    const { result } = renderHook(
      () =>
        useIpRestrictions(
          'project-id',
          'registry-id',
          ['management', 'registry'],
          selectMock,
        ),
      { wrapper },
    );

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

  it('should successfully update IP restrictions', async () => {
    const mockInvalidate = vi.fn();
    (updateIpRestriction as Mock).mockResolvedValue(null);
    queryClient.invalidateQueries = mockInvalidate;

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdateIpRestriction({
          projectId: 'project-id',
          registryId: 'registry-id',
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    const params = {
      cidrToUpdate: {
        management: [
          { id: '1', ipBlock: '192.168.0.2/24', description: 'allow' },
        ],
      },
      action: 'REPLACE' as const,
    };

    await act(async () => {
      result.current.updateIpRestrictions(params);
    });

    expect(updateIpRestriction).toHaveBeenCalledWith(
      'project-id',
      'registry-id',
      params.cidrToUpdate,
      'REPLACE',
    );
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
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should call onError when update fails', async () => {
    const error = new Error('Update failed');
    (updateIpRestriction as Mock).mockRejectedValue(error);

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdateIpRestriction({
          projectId: 'project-id',
          registryId: 'registry-id',
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    const params = {
      cidrToUpdate: {
        management: [
          { id: '1', ipBlock: '192.168.0.1/24', description: 'allow' },
        ],
      },
      action: 'DELETE' as const,
    };

    await act(async () => {
      result.current.updateIpRestrictions(params);
    });

    expect(updateIpRestriction).toHaveBeenCalledWith(
      'project-id',
      'registry-id',
      params.cidrToUpdate,
      'DELETE',
    );
    expect(onError).toHaveBeenCalledWith(
      error,
      {
        action: 'DELETE',
        cidrToUpdate: {
          management: [
            {
              description: 'allow',
              id: '1',
              ipBlock: '192.168.0.1/24',
            },
          ],
        },
      },
      undefined,
    );
  });
});
