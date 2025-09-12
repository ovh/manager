import { vi, describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDataApi } from '../useDataApi';
import { useV6 } from '../ports/v6/useV6';
import { useV2 } from '../ports/v2/useV2';
import { useIceberg } from '../ports/iceberg/useIceberg';
import { columns, getSorting } from './Test.utils';
import { UseDataApiOptions } from '../useDataApi.types';

vi.mock('../ports/v6/useV6', () => {
  return {
    useV6: vi.fn(),
  };
});

vi.mock('../ports/v2/useV2', () => {
  return {
    useV2: vi.fn(),
  };
});

vi.mock('../ports/iceberg/useIceberg', () => {
  return {
    useIceberg: vi.fn(),
  };
});

// parameters
const route = '/sample/route';
const pageSize = 50;
const queryKey = 'sample-query-key';
const defaultSorting = getSorting('name', false);
const enabled = false;
const fetchAll = false;
const disableCache = false;
const queryFn = vi.fn();
const refetchInterval = 5000;

const renderUseDataApi = (options: UseDataApiOptions<Record<string, string>>) =>
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
      queryKey,
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
        queryKey,
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
      queryKey,
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
        queryKey,
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
      queryKey,
      refetchInterval,
      defaultSorting,
      fetchAll,
      queryFn,
      columns,
      disableCache,
      enabled,
    });
    expect(useV6).toHaveBeenCalledWith(
      expect.objectContaining({
        route,
        queryKey,
        queryFn,
        refetchInterval,
        enabled,
        pageSize,
        columns,
        defaultSorting,
      }),
    );
  });
});
