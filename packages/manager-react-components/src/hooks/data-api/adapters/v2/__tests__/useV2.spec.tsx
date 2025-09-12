import { vi, describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { fetchV2, FetchV2Params } from '@ovh-ux/manager-core-api';
import { getWrapper } from '../../../__tests__/Test.utils';
import { items } from '../../../__mocks__/mock';
import { useV2 } from '../useV2';
import { UseV2Params } from '../useV2.types';

vi.mock('@ovh-ux/manager-core-api', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...actual,
    fetchV2: vi.fn(),
  };
});

function renderUseV2Hook(hookParams: Partial<UseV2Params> = {}) {
  return renderHook(
    () =>
      useV2({
        route: '/dedicated/nasha',
        cacheKey: '/dedicated/nasha',
        ...hookParams,
      }),
    {
      wrapper: getWrapper(),
    },
  );
}

describe('useIceberg hook', () => {
  beforeEach(() => {
    vi.mocked(fetchV2).mockResolvedValueOnce({
      data: items,
      totalCount: 50,
      status: '200',
    } as any);
    vi.clearAllMocks();
  });

  it('tests the default params', () => {
    renderUseV2Hook();
    const callArg = vi.mocked(fetchV2).mock.calls[0]?.[0];
    expect((callArg as FetchV2Params).route).toBe('/dedicated/nasha');
    expect((callArg as FetchV2Params).pageSize).toBe(10);
  });

  it('does not make API call when enabled=false', () => {
    renderUseV2Hook({ enabled: false });
    expect(fetchV2).not.toHaveBeenCalled();
  });
});
