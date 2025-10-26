import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ResultObj, columns } from '../__mocks__/mock';
import { useIceberg } from '../adapters/iceberg/useIceberg';
import { useV2 } from '../adapters/v2/useV2';
import { useV6 } from '../adapters/v6/useV6';
import { useDataApi } from '../ports/useDataApi';
import { UseDataApiOptions } from '../ports/useDataApi.types';

vi.mock('../adapters/v6/useV6', () => {
  return {
    useV6: vi.fn(),
  };
});

vi.mock('../adapters/v2/useV2', () => {
  return {
    useV2: vi.fn(),
  };
});

vi.mock('../adapters/iceberg/useIceberg', () => {
  return {
    useIceberg: vi.fn(),
  };
});

// parameters
const route = '/sample/route';
const pageSize = 50;
const cacheKey = 'sample-query-key';
const defaultSorting = [{ id: 'name', desc: false }];
const enabled = false;
const fetchAll = false;
const disableCache = false;
const fetchDataFn = vi.fn();
const refetchInterval = 5000;

const renderUseDataApi = (options: UseDataApiOptions<ResultObj>) =>
  renderHook(() => useDataApi(options));

describe('useDataApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the call to iceberg', () => {
    renderUseDataApi({
      version: 'v6',
      iceberg: true,
      route,
      pageSize,
      cacheKey,
      refetchInterval,
      defaultSorting,
      fetchAll,
      columns,
      disableCache,
      enabled,
    });
    expect(useIceberg).toHaveBeenCalledWith(
      expect.objectContaining({
        version: 'v6',
        route,
        pageSize,
        cacheKey,
        enabled,
        defaultSorting,
        fetchAll,
        columns,
        disableCache,
      }),
    );
  });

  it('forwards the call to useV2', () => {
    renderUseDataApi({
      version: 'v2',
      iceberg: false,
      route,
      pageSize,
      cacheKey,
      refetchInterval,
      defaultSorting,
      fetchAll,
      columns,
      disableCache,
      enabled,
    });
    expect(useV2).toHaveBeenCalledWith(
      expect.objectContaining({
        route,
        pageSize,
        enabled,
        cacheKey,
        fetchAll,
      }),
    );
  });

  it('forwards the call to useV6', () => {
    renderUseDataApi({
      version: 'v6',
      iceberg: false,
      route,
      pageSize,
      cacheKey,
      refetchInterval,
      defaultSorting,
      fetchAll,
      fetchDataFn,
      columns,
      disableCache,
      enabled,
    });
    expect(useV6).toHaveBeenCalledWith(
      expect.objectContaining({
        route,
        cacheKey,
        fetchDataFn,
        refetchInterval,
        enabled,
        pageSize,
        columns,
        defaultSorting,
      }),
    );
  });
});
