import { renderHook, waitFor, act } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { applyFilters } from '@ovh-ux/manager-core-api';
import { Filter, PaginationState } from '@ovh-ux/manager-react-components';
import {
  TUpdateIpRestrictionMutationParams,
  useIpRestrictions,
  useIpRestrictionsWithFilter,
  useUpdateIpRestriction,
} from './useIpRestrictions';
import { wrapper } from '@/wrapperRenders';
import {
  getIpRestrictions,
  updateIpRestriction,
} from '../data/ip-restrictions';
import queryClient from '@/queryClient';
import { FilterRestrictionsServer } from '@/types';
import * as helpers from '@/helpers';

vi.mock('../data/ip-restrictions');
vi.mock('@/queryClient');
vi.mock('@ovh-ux/manager-core-api');

const renderIpRestrictionsHook = (
  projectId: string,
  registryId: string,
  scopes: FilterRestrictionsServer[],
  select?: (data: any) => any,
) =>
  renderHook(() => useIpRestrictions(projectId, registryId, scopes, select), {
    wrapper,
  });

const renderUpdateIpRestrictionHook = (
  projectId: string,
  registryId: string,
  onSuccess: Mock,
  onError: Mock,
) =>
  renderHook(
    () =>
      useUpdateIpRestriction({
        projectId,
        registryId,
        onSuccess,
        onError,
      }),
    { wrapper },
  );

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

    const { result } = renderIpRestrictionsHook('project-id', 'registry-id', [
      'management',
      'registry',
    ]);

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

    const { result } = renderIpRestrictionsHook(
      'project-id',
      'registry-id',
      ['management', 'registry'],
      selectMock,
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

    const { result } = renderUpdateIpRestrictionHook(
      'project-id',
      'registry-id',
      onSuccess,
      onError,
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
      result.current.updateIpRestrictions(
        (params as unknown) as TUpdateIpRestrictionMutationParams,
      );
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

    const { result } = renderUpdateIpRestrictionHook(
      'project-id',
      'registry-id',
      onSuccess,
      onError,
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
      result.current.updateIpRestrictions(
        (params as unknown) as TUpdateIpRestrictionMutationParams,
      );
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

const renderIpRestrictionsWithFilterHook = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[],
  pagination: PaginationState,
  filters: Filter,
) =>
  renderHook(
    () =>
      useIpRestrictionsWithFilter(
        projectId,
        registryId,
        type,
        pagination,
        filters,
      ),
    { wrapper },
  );

describe('useIpRestrictionsWithFilter Hook Tests', () => {
  it('should fetch and paginate IP restrictions successfully', async () => {
    const mockData = [
      { id: 'fromMockData1', ipBlock: '192.168.0.1/24', description: 'allow' },
      { id: '2', ipBlock: '10.0.0.0/8', description: 'deny' },
    ];
    const filteredData = [mockData[0]];
    const paginatedData = {
      rows: filteredData,
      pageCount: 0,
      totalRows: filteredData.length,
    };
    (getIpRestrictions as Mock).mockResolvedValueOnce(mockData);
    (applyFilters as Mock).mockReturnValueOnce(filteredData);
    const paginateResults = vi
      .spyOn(helpers, 'paginateResults')
      .mockReturnValue(paginatedData);

    const pagination = { pageIndex: 0, pageSize: 10 };
    const filters: Filter = {
      key: 'ipBlock',
      value: '192.168.0.1',
      comparator: 'includes',
      label: '',
    };

    const { result } = renderIpRestrictionsWithFilterHook(
      'project-id',
      'registry-id',
      ['management', 'registry'],
      pagination,
      filters,
    );

    await waitFor(() => expect(result.current.data).toEqual(paginatedData));

    expect(getIpRestrictions).toHaveBeenCalledWith(
      'project-id',
      'registry-id',
      ['management', 'registry'],
    );
    expect(applyFilters).toHaveBeenCalledWith(mockData, filters);
    expect(paginateResults).toHaveBeenCalledWith(filteredData, pagination);
  });

  it('should return empty rows if no data matches filters', async () => {
    const mockData = [
      { id: '1', ipBlock: '192.168.0.1/24', description: 'allow' },
      { id: '2', ipBlock: '10.0.0.0/8', description: 'deny' },
    ];
    const filteredData: never[] = [];
    const paginatedData = {
      rows: filteredData,
      pageCount: 0,
      totalRows: filteredData.length,
    };
    (getIpRestrictions as Mock).mockResolvedValueOnce(mockData);
    (applyFilters as Mock).mockReturnValueOnce(filteredData);

    const paginateResults = vi
      .spyOn(helpers, 'paginateResults')
      .mockReturnValue(paginatedData);

    const pagination = {
      pageIndex: 0,
      pageSize: 10,
    };
    const filters = { description: 'block' };

    const { result } = renderIpRestrictionsWithFilterHook(
      'project-id',
      'registry-id',
      ['management', 'registry'],
      pagination,
      filters,
    );

    await waitFor(() => expect(result.current.data).toEqual(paginatedData));

    expect(getIpRestrictions).toHaveBeenCalledWith(
      'project-id',
      'registry-id',
      ['management', 'registry'],
    );
    expect(applyFilters).toHaveBeenCalledWith(mockData, filters);
    expect(paginateResults).toHaveBeenCalledWith(filteredData, pagination);
  });
});
