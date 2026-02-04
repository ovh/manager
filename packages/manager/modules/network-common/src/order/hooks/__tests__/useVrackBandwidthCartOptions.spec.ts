import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import {
  DEFAULT_BANDWIDTH_PLAN_CODE,
  useVrackBandwidthCartOptions,
} from '../useVrackBandwidthCartOptions';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../../api/get/cartServiceOption', () => ({
  getCartServiceOption: vi.fn(),
}));

describe('useVrackBandwidthCartOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns bandwidth options per region when query provides data', () => {
    const serviceName = 'vrack-1';

    const apiResult = {
      data: [
        {
          family: 'outgoing-bandwidth',
          planCode: 'outgoing-bandwidth-eu-10g',
          prices: [
            {
              capacities: ['renew'],
              price: { currencyCode: 'EUR', value: 5, text: '5 €' },
              priceInUcents: 500,
            },
          ],
        },
        {
          family: 'outgoing-bandwidth',
          planCode: 'outgoing-bandwidth-ap-200m',
          prices: [
            {
              capacities: ['renew'],
              price: { currencyCode: 'EUR', value: 8, text: '8 €' },
              priceInUcents: 800,
            },
          ],
        },
      ],
    };

    // mock useQuery to return the apiResult
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: apiResult,
    } as UseQueryResult<unknown, unknown>);

    const { result } = renderHook(() =>
      useVrackBandwidthCartOptions({ serviceName, regions: ['eu', 'ap'] }),
    );

    // useQuery should have been called with enabled = true
    expect(vi.mocked(useQuery)).toHaveBeenCalled();
    const firstCallArg = (vi.mocked(useQuery).mock
      .calls[0][0] as unknown) as Record<string, unknown>;
    expect(firstCallArg.enabled).toBe(true);

    // For 'eu' region we expect one option (10g => 10000) and default appended
    const euList = result.current.vrackCartBandwidthOptionListByRegion['eu'];
    expect(euList).toBeDefined();
    expect(euList.length).toBeGreaterThanOrEqual(1);
    expect(euList.some((o) => o.planCode === 'outgoing-bandwidth-eu-10g')).toBe(
      true,
    );

    // Default plan exists
    expect(euList.some((o) => o.planCode === DEFAULT_BANDWIDTH_PLAN_CODE)).toBe(
      true,
    );

    // For 'ap' region, expect the 200m option and default
    const apList = result.current.vrackCartBandwidthOptionListByRegion['ap'];
    expect(apList).toBeDefined();
    expect(
      apList.some((o) => o.planCode === 'outgoing-bandwidth-ap-200m'),
    ).toBe(true);
    expect(apList.some((o) => o.planCode === DEFAULT_BANDWIDTH_PLAN_CODE)).toBe(
      true,
    );
  });

  it('returns empty lists when regions is empty (query disabled)', () => {
    const serviceName = 'vrack-2';
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: null,
    } as UseQueryResult<unknown, unknown>);

    const { result } = renderHook(() =>
      useVrackBandwidthCartOptions({ serviceName, regions: [] }),
    );

    // useQuery should have been called with enabled = false when no regions
    expect(vi.mocked(useQuery)).toHaveBeenCalled();
    const firstCallArg2 = (vi.mocked(useQuery).mock
      .calls[0][0] as unknown) as Record<string, unknown>;
    expect(firstCallArg2.enabled).toBe(false);

    expect(result.current.vrackCartBandwidthOptionListByRegion).toEqual({});
  });
});
