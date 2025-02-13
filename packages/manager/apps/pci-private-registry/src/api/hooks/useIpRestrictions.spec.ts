import { renderHook, waitFor, act } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import {
  applyFilters,
  Filter,
  FilterComparator,
} from '@ovh-ux/manager-core-api';

import { ColumnSort } from '@ovh-ux/manager-react-components';
import {
  sortIpRestrictions,
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
import { FilterRestrictionsServer, TIPRestrictionsData } from '@/types';
import * as helpers from '@/helpers';

vi.mock('../data/ip-restrictions');
vi.mock('@/queryClient');
vi.mock('@ovh-ux/manager-core-api');

const renderHookWithWrapper = <T>(
  hook: (...params: unknown[]) => T,
  params: unknown[],
) => renderHook(() => hook(...params), { wrapper });

const projectId = 'project-id';
const registryId = 'registry-id';
const scopes: FilterRestrictionsServer[] = ['management', 'registry'];

const mockData = [
  { ipBlock: '192.168.0.1/24', description: 'allow' },
  { ipBlock: '10.0.0.0/8', description: 'deny' },
];

describe('useIpRestrictions Hook Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    {
      description: 'should fetch IP restrictions successfully',
      mockedResponse: mockData,
      expectedResult: mockData,
      select: undefined,
    },
    {
      description: 'should apply a selector to fetched IP restrictions',
      mockedResponse: [
        { id: '1', ipBlock: '192.168.0.2/32', description: 'allow' },
        { id: '2', ipBlock: '10.0.0.0/8', description: 'deny' },
      ],
      expectedResult: [
        { id: '1', ipBlock: '192.168.0.2/32', description: 'allow' },
      ],
      select: vi.fn((data: unknown[]) =>
        data.filter(
          (item: { description: string }) => item.description === 'allow',
        ),
      ),
    },
  ])('$description', async ({ mockedResponse, expectedResult, select }) => {
    (getIpRestrictions as Mock).mockResolvedValueOnce(mockedResponse);

    const { result } = renderHookWithWrapper(useIpRestrictions, [
      projectId,
      registryId,
      scopes,
      select,
    ]);

    await waitFor(() => expect(result.current.data).toEqual(expectedResult));
    expect(getIpRestrictions).toHaveBeenCalledWith(
      projectId,
      registryId,
      scopes,
    );

    if (select) {
      expect(select).toHaveBeenCalledWith(mockedResponse);
    }
  });
});

describe('useUpdateIpRestriction Hook Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    {
      description: 'should successfully update IP restrictions',
      params: {
        cidrToUpdate: {
          management: [
            { id: '1', ipBlock: '192.168.0.2/24', description: 'allow' },
          ],
        },
        action: 'REPLACE' as const,
      },
      mockResponse: null,
      onSuccessCalled: true,
      onErrorCalled: false,
    },
    {
      description: 'should call onError when update fails',
      params: {
        cidrToUpdate: {
          management: [
            { id: '1', ipBlock: '192.168.0.1/24', description: 'allow' },
          ],
        },
        action: 'DELETE' as const,
      },
      mockResponse: new Error('Update failed'),
      onSuccessCalled: false,
      onErrorCalled: true,
    },
  ])(
    '$description',
    async ({ params, mockResponse, onSuccessCalled, onErrorCalled }) => {
      const mockInvalidate = vi.fn();
      queryClient.invalidateQueries = mockInvalidate;

      const onSuccess = vi.fn();
      const onError = vi.fn();

      if (mockResponse instanceof Error) {
        (updateIpRestriction as Mock).mockRejectedValueOnce(mockResponse);
      } else {
        (updateIpRestriction as Mock).mockResolvedValueOnce(mockResponse);
      }

      const { result } = renderHookWithWrapper(useUpdateIpRestriction, [
        { projectId, registryId, onSuccess, onError },
      ]);

      await act(async () =>
        result.current.updateIpRestrictions(
          (params as unknown) as TUpdateIpRestrictionMutationParams,
        ),
      );

      expect(updateIpRestriction).toHaveBeenCalledWith(
        projectId,
        registryId,
        params.cidrToUpdate,
        params.action,
      );

      if (onSuccessCalled) expect(onSuccess).toHaveBeenCalled();
      if (onErrorCalled)
        expect(onError).toHaveBeenCalledWith(mockResponse, params, undefined);
    },
  );
});

describe('sortIpRestrictions Function', () => {
  const mockDataCIDR = [
    { ipBlock: '10.0.0.1/32', description: 'allow' },
    { ipBlock: '192.168.0.0/24', description: 'deny' },
    { ipBlock: '172.16.0.0/16', description: 'allow' },
  ] as TIPRestrictionsData[];

  test('should sort IP restrictions in ascending order by ipBlock', () => {
    const sorting: ColumnSort = { id: 'ipBlock', desc: false };
    const expectedResult = [
      { ipBlock: '10.0.0.1/32', description: 'allow' },
      { ipBlock: '172.16.0.0/16', description: 'allow' },
      { ipBlock: '192.168.0.0/24', description: 'deny' },
    ];

    const result = sortIpRestrictions(mockDataCIDR, sorting);
    expect(result).toEqual(expectedResult);
  });

  test('should sort IP restrictions in descending order by description', () => {
    const sorting: ColumnSort = { id: 'description', desc: true };
    const expectedResult = [
      { ipBlock: '192.168.0.0/24', description: 'deny' },
      { ipBlock: '172.16.0.0/16', description: 'allow' },
      { ipBlock: '10.0.0.1/32', description: 'allow' },
    ];

    const result = sortIpRestrictions(mockDataCIDR, sorting);
    expect(result).toEqual(expectedResult);
  });

  test('should return unsorted data when no sorting is provided', () => {
    const sorting: ColumnSort = (undefined as unknown) as ColumnSort;
    const result = sortIpRestrictions(mockDataCIDR, sorting);
    expect(result).toEqual(mockDataCIDR);
  });
});

describe('useIpRestrictionsWithFilter Hook Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    {
      description: 'should fetch and paginate IP restrictions successfully',
      filters: [
        {
          key: 'ipBlock',
          value: '192.168.0.1',
          comparator: FilterComparator.Includes,
          label: '',
        },
      ],
      mockFilteredData: [mockData[0]],
      expectedPaginatedData: {
        rows: [mockData[0]],
        pageCount: 0,
        totalRows: 1,
      },
    },
    {
      description: 'should return empty rows if no data matches filters',
      filters: [
        {
          key: 'description',
          value: 'block',
          comparator: FilterComparator.Includes,
          label: '',
        },
      ],
      mockFilteredData: [],
      expectedPaginatedData: { rows: [], pageCount: 0, totalRows: 0 },
    },
  ])(
    '$description',
    async ({ filters, mockFilteredData, expectedPaginatedData }) => {
      (getIpRestrictions as Mock).mockResolvedValueOnce(mockData);
      (applyFilters as Mock).mockReturnValueOnce(mockFilteredData);
      vi.spyOn(helpers, 'paginateResults').mockReturnValue(
        expectedPaginatedData,
      );

      const pagination = { pageIndex: 0, pageSize: 10 };

      const { result } = renderHookWithWrapper(useIpRestrictionsWithFilter, [
        projectId,
        registryId,
        scopes,
        pagination,
        filters,
      ]);

      await waitFor(() =>
        expect(result.current.data).toEqual(expectedPaginatedData),
      );

      expect(getIpRestrictions).toHaveBeenCalledWith(
        projectId,
        registryId,
        scopes,
      );
      expect(applyFilters).toHaveBeenCalledWith(
        mockData.map((mock) => ({
          ...mock,
          id: mock.ipBlock,
          checked: false,
          draft: false,
        })),
        filters,
      );
      expect(helpers.paginateResults).toHaveBeenCalledWith(
        mockFilteredData,
        pagination,
      );
    },
  );
});
