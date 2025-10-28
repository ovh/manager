import { RenderHookResult, renderHook } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { fetchWithIceberg } from '@ovh-ux/manager-core-api';

import { ResultObj, columns } from '../../../__mocks__/mock';
import { getSorting, getWrapper } from '../../../__tests__/Test.utils';
import type { UseDataApiResult } from '../../../ports/useDataApi.types';
import { useIceberg } from '../useIceberg';
import { UseIcebergParams } from '../useIceberg.type';

vi.mock('@ovh-ux/manager-core-api', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...actual,
    fetchWithIceberg: vi.fn(),
  };
});

const renderUseIcebergHook = (
  hookParams: Partial<UseIcebergParams<ResultObj>> = {},
): RenderHookResult<UseDataApiResult<ResultObj>, UseIcebergParams> => {
  return renderHook(
    () =>
      useIceberg({
        version: 'v6',
        columns,
        route: '/dedicated/nasha',
        cacheKey: '/dedicated/nasha',
        ...hookParams,
      }),
    {
      wrapper: getWrapper(),
    },
  );
};

describe('useIceberg hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tests the default params', () => {
    renderUseIcebergHook();
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect(callArg?.version).toBe('v6');
    expect(callArg?.route).toBe('/dedicated/nasha');
    expect(callArg?.pageSize).toBe(10);
  });

  it('makes a call to fetchIceberg with version=v6', () => {
    renderUseIcebergHook({ version: 'v6' });
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect(callArg?.version).toBe('v6');
  });

  it('makes a call to fetchIceberg with version=v2', () => {
    renderUseIcebergHook({ version: 'v2' });
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect(callArg?.version).toBe('v2');
  });

  it('does not make API call when enabled=false', () => {
    renderUseIcebergHook({ enabled: false });
    expect(fetchWithIceberg).not.toHaveBeenCalled();
  });

  it('tests default sorting', () => {
    renderUseIcebergHook({ defaultSorting: [getSorting('number', false)] });
    const callArg = vi.mocked(fetchWithIceberg).mock.calls[0]?.[0];
    expect(callArg?.sortBy).toEqual('number');
    expect(callArg?.sortOrder).toEqual('ASC');
  });
});
