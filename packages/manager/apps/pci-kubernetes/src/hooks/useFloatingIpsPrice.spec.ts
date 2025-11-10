import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCatalog } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getPlanCodeFloatingIps } from '@/helpers/node-pool';
import { DeploymentMode } from '@/types';

import useFloatingIpsPrice from './useFloatingIpsPrice';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useCatalog: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn(),
  convertHourlyPriceToMonthly: vi.fn((price) => price * 10),
}));

vi.mock('@/helpers/node-pool', () => ({
  getPlanCodeFloatingIps: vi.fn(),
}));

describe('useFloatingIpsPrice', () => {
  const mockGetFormattedHourlyCatalogPrice = vi.fn((price) => `${price} €/hour`);
  const mockGetFormattedMonthlyCatalogPrice = vi.fn((price) => `${price} €/month`);

  const mockCatalog = {
    addons: [
      {
        planCode: 'floatingip.floatingip.hour.consumption',
        pricings: [{ price: 0.5 }],
      },
      {
        planCode: 'floatingip.floatingip.hour.consumption.3AZ',
        pricings: [{ price: 1.5 }],
      },
      {
        planCode: 'floatingip.floatingip.month.consumption',
        pricings: [{ price: 5 }],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCatalogPrice).mockReturnValue({
      getFormattedHourlyCatalogPrice: mockGetFormattedHourlyCatalogPrice,
      getFormattedMonthlyCatalogPrice: mockGetFormattedMonthlyCatalogPrice,
    } as unknown as ReturnType<typeof useCatalogPrice>);
  });

  it.each([
    {
      description: 'catalog is loading',
      catalogData: undefined,
      isPendingCatalog: true,
      enabled: true,
      planCode: null,
      expectedIsPending: true,
      shouldNotCallGetPlanCode: false,
    },
    {
      description: 'enabled is false',
      catalogData: mockCatalog,
      isPendingCatalog: false,
      enabled: false,
      planCode: null,
      expectedIsPending: false,
      shouldNotCallGetPlanCode: true,
    },
    {
      description: 'getPlanCodeFloatingIps returns null',
      catalogData: mockCatalog,
      isPendingCatalog: false,
      enabled: true,
      planCode: null,
      expectedIsPending: false,
      shouldNotCallGetPlanCode: false,
    },
    {
      description: 'addon does not exist in catalog',
      catalogData: mockCatalog,
      isPendingCatalog: false,
      enabled: true,
      planCode: 'floatingip.floatingip.hour.consumption.nonexistent',
      expectedIsPending: false,
      shouldNotCallGetPlanCode: false,
    },
  ])(
    'should return price as null when $description',
    ({
      catalogData,
      isPendingCatalog,
      enabled,
      planCode,
      expectedIsPending,
      shouldNotCallGetPlanCode,
    }) => {
      vi.mocked(useCatalog).mockReturnValue({
        data: catalogData,
        isPending: isPendingCatalog,
      } as ReturnType<typeof useCatalog>);

      if (planCode !== null) {
        vi.mocked(getPlanCodeFloatingIps).mockReturnValue(planCode);
      }

      const { result } = renderHook(() =>
        useFloatingIpsPrice(enabled, 'hour', DeploymentMode.MONO_ZONE),
      );

      expect(result.current).toEqual({
        isPending: expectedIsPending,
        price: null,
      });

      if (shouldNotCallGetPlanCode) {
        expect(getPlanCodeFloatingIps).not.toHaveBeenCalled();
      }
    },
  );

  it('should return price as null when pricing array is empty', () => {
    const catalogWithoutPricing = {
      addons: [
        {
          planCode: 'floatingip.floatingip.hour.consumption',
          pricings: [],
        },
      ],
    };

    vi.mocked(useCatalog).mockReturnValue({
      data: catalogWithoutPricing,
      isPending: false,
    } as unknown as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockReturnValue('floatingip.floatingip.hour.consumption');

    const { result } = renderHook(() =>
      useFloatingIpsPrice(true, 'hour', DeploymentMode.MONO_ZONE),
    );

    expect(result.current).toEqual({
      isPending: false,
      price: null,
    });
  });

  it.each([
    {
      description: 'MONO_ZONE deployment with hourly billing',
      deploymentMode: DeploymentMode.MONO_ZONE,
      time: 'hour' as const,
      planCode: 'floatingip.floatingip.hour.consumption',
      expectedPrice: {
        hour: 0.5,
        month: 5,
        hourFormatted: '0.5 €/hour',
        monthFormatted: '5 €/month',
      },
      expectFormatterCalls: true,
    },
    {
      description: 'MULTI_ZONES deployment with hourly billing',
      deploymentMode: DeploymentMode.MULTI_ZONES,
      time: 'hour' as const,
      planCode: 'floatingip.floatingip.hour.consumption.3AZ',
      expectedPrice: {
        hour: 1.5,
        month: 15,
        hourFormatted: '1.5 €/hour',
        monthFormatted: '15 €/month',
      },
      expectFormatterCalls: true,
    },
    {
      description: 'LOCAL_ZONE deployment with hourly billing',
      deploymentMode: DeploymentMode.LOCAL_ZONE,
      time: 'hour' as const,
      planCode: 'floatingip.floatingip.hour.consumption',
      expectedPrice: {
        hour: 0.5,
        month: 5,
        hourFormatted: '0.5 €/hour',
        monthFormatted: '5 €/month',
      },
      expectFormatterCalls: false,
    },
    {
      description: 'MONO_ZONE deployment with monthly billing',
      deploymentMode: DeploymentMode.MONO_ZONE,
      time: 'month' as const,
      planCode: 'floatingip.floatingip.month.consumption',
      expectedPrice: {
        hour: 5,
        month: 50,
        hourFormatted: '5 €/hour',
        monthFormatted: '50 €/month',
      },
      expectFormatterCalls: false,
    },
  ])(
    'should return formatted prices for $description',
    ({ deploymentMode, time, planCode, expectedPrice, expectFormatterCalls }) => {
      vi.mocked(useCatalog).mockReturnValue({
        data: mockCatalog,
        isPending: false,
      } as ReturnType<typeof useCatalog>);

      vi.mocked(getPlanCodeFloatingIps).mockReturnValue(planCode);

      const { result } = renderHook(() => useFloatingIpsPrice(true, time, deploymentMode));

      expect(result.current).toEqual({
        isPending: false,
        price: expectedPrice,
      });

      if (expectFormatterCalls) {
        expect(mockGetFormattedHourlyCatalogPrice).toHaveBeenCalledWith(expectedPrice.hour);
        expect(mockGetFormattedMonthlyCatalogPrice).toHaveBeenCalledWith(expectedPrice.month);
      }
    },
  );

  it.each([
    {
      description: 'null deploymentMode',
      catalog: mockCatalog,
      planCode: null,
      deploymentMode: null,
      expectedPrice: null,
      expectGetPlanCodeCall: true,
    },
    {
      description: 'price of 0',
      catalog: {
        addons: [
          {
            planCode: 'floatingip.floatingip.hour.consumption',
            pricings: [{ price: 0 }],
          },
        ],
      },
      planCode: 'floatingip.floatingip.hour.consumption',
      deploymentMode: DeploymentMode.MONO_ZONE,
      expectedPrice: {
        hour: 0,
        month: 0,
        hourFormatted: '0 €/hour',
        monthFormatted: '0 €/month',
      },
      expectGetPlanCodeCall: false,
    },
  ])(
    'should handle $description',
    ({ catalog, planCode, deploymentMode, expectedPrice, expectGetPlanCodeCall }) => {
      vi.mocked(useCatalog).mockReturnValue({
        data: catalog,
        isPending: false,
      } as ReturnType<typeof useCatalog>);

      vi.mocked(getPlanCodeFloatingIps).mockReturnValue(planCode);

      const { result } = renderHook(() => useFloatingIpsPrice(true, 'hour', deploymentMode));

      expect(result.current).toEqual({
        isPending: false,
        price: expectedPrice,
      });

      if (expectGetPlanCodeCall) {
        expect(getPlanCodeFloatingIps).toHaveBeenCalledWith('hour', null);
      }
    },
  );

  it('should use useCatalogPrice with precision of 5', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as unknown as ReturnType<typeof useCatalog>);

    renderHook(() => useFloatingIpsPrice(true, 'hour', DeploymentMode.MONO_ZONE));

    expect(useCatalogPrice).toHaveBeenCalledWith(5);
  });

  it('should return price from correct addon based on plan code', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as unknown as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockReturnValue('floatingip.floatingip.hour.consumption.3AZ');

    const { result } = renderHook(() =>
      useFloatingIpsPrice(true, 'hour', DeploymentMode.MULTI_ZONES),
    );

    expect(result.current.price?.hour).toBe(1.5);
  });

  it('should return null when catalog is undefined', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: undefined,
      isPending: false,
    } as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockReturnValue('floatingip.floatingip.hour.consumption');

    const { result } = renderHook(() =>
      useFloatingIpsPrice(true, 'hour', DeploymentMode.MONO_ZONE),
    );

    expect(result.current).toEqual({
      isPending: false,
      price: null,
    });
  });
});
