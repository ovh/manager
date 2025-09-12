import React from 'react';
import { vi, describe, it } from 'vitest';
import { renderHook, RenderHookResult } from '@testing-library/react';
import { fetchWithIceberg, IcebergFetchParams } from '@ovh-ux/manager-core-api';
import {
  getWrapper,
  items,
  columns,
  getSorting,
  ResultObj,
} from '../../../__tests__/Test.utils';
import { UseIcebergParams } from '../useIceberg.type';
import { useIceberg } from '../useIceberg';
import type { UseDataApiResult } from '../../../useDataApi.types';

vi.mock('@ovh-ux/manager-core-api', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...actual,
    fetchWithIceberg: vi.fn(),
  };
});

const renderUseIcebergHook = <ResultObj = unknown,>(
  hookParams: Partial<UseIcebergParams<ResultObj>> = {},
): RenderHookResult<UseDataApiResult<ResultObj>, UseIcebergParams> => {
  return renderHook(
    () =>
      useIceberg({
        version: 'v6',
        columns,
        route: '/dedicated/nasha',
        queryKey: '/dedicated/nasha',
        ...hookParams,
      }),
    {
      wrapper: getWrapper(),
    },
  );
};

describe('useIceberg hook', () => {
  beforeEach(() => {
    // vi.mocked(fetchWithIceberg).mockImplementation(() => {
    //   return Promise.resolve({
    //     data: items,
    //     totalCount: 50,
    //     status: '200',
    //   } as any);
    // });
    vi.clearAllMocks();
  });

  it('tests the default params', () => {
    renderUseIcebergHook();
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect((callArg as IcebergFetchParams).version).toBe('v6');
    expect((callArg as IcebergFetchParams).route).toBe('/dedicated/nasha');
    expect((callArg as IcebergFetchParams).pageSize).toBe(10);
  });

  it('makes a call to fetchIceberg with version=v6', () => {
    renderUseIcebergHook({ version: 'v6' });
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect((callArg as IcebergFetchParams).version).toBe('v6');
  });

  it('makes a call to fetchIceberg with version=v2', () => {
    renderUseIcebergHook({ version: 'v2' });
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect((callArg as IcebergFetchParams).version).toBe('v2');
  });

  it('does not make API call when enabled=false', () => {
    renderUseIcebergHook({ enabled: false });
    expect(fetchWithIceberg).not.toHaveBeenCalled();
  });

  it('tests default sorting', () => {
    renderUseIcebergHook({ defaultSorting: getSorting('number', false) });
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect((callArg as IcebergFetchParams).sortBy).toEqual('number');
    expect((callArg as IcebergFetchParams).sortOrder).toEqual('ASC');
  });

  // it('applies sorting', () => {
  //   const {result } = renderUseIcebergHook();
  //   act(() => {
  //     result.current.setSorting(getSorting('number', true));
  //   });
  //   const [[callArg]] = vi.mocked(fetchWithIceberg).mock.calls;
  //   expect(callArg.sortBy).toEqual('number');
  //   expect(callArg.sortOrder).toEqual('DESC');
  // });

  // it('applies filtering', () => {
  //   const {result } = renderUseIcebergHook();
  //   act(() => {
  //     result.current.filters.add(getFilter('number', String(15), FilterComparator.IsHigher, FilterTypeCategories.Numeric));
  //   });
  //   const [[callArg]] = vi.mocked(fetchWithIceberg).mock.calls;
  //   // expect(callArg.filters).toEqual(1);
  // });

  // it('fetches next page', () => {
  //   const { result } = renderUseIcebergHook();
  //   console.log(result);
  //   expect(result.current.hasNextPage).toBeTruthy();
  //   act(() => {
  //     result.current.fetchNextPage();
  //   });
  //   const [[callArg]] = vi.mocked(fetchWithIceberg).mock.calls;
  //   expect(callArg.page).toBe(2);
  // });

  // it('fetches all the records', () => {
  //   // check for queryKey
  //   const { result } = renderUseIcebergHook({ fetchAll: true });
  //   const [[callArg]] = vi.mocked(fetchWithIceberg).mock.calls;
  //   expect(fetchWithIceberg).toHaveBeenCalledTimes(5);
  // });

  // it('returns the data in required format', () => {});
});
