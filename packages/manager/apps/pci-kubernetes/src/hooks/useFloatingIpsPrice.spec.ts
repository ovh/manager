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

      const { result } = renderHook(() => useFloatingIpsPrice(enabled, DeploymentMode.MONO_ZONE));

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

    const { result } = renderHook(() => useFloatingIpsPrice(true, DeploymentMode.MONO_ZONE));

    expect(result.current).toEqual({
      isPending: false,
      price: null,
    });
  });

  it.each([
    {
      description: 'MONO_ZONE deployment',
      deploymentMode: DeploymentMode.MONO_ZONE,
      planCodeHour: 'floatingip.floatingip.hour.consumption',
      planCodeMonth: 'floatingip.floatingip.month.consumption',
      expectedPrice: {
        hour: 0.5,
        month: 5,
        hourFormatted: '0.5 €/hour',
        monthFormatted: '5 €/month',
      },
    },
    {
      description: 'MULTI_ZONES deployment',
      deploymentMode: DeploymentMode.MULTI_ZONES,
      planCodeHour: 'floatingip.floatingip.hour.consumption.3AZ',
      planCodeMonth: null,
      expectedPrice: {
        hour: 1.5,
        month: 15,
        hourFormatted: '1.5 €/hour',
        monthFormatted: '15 €/month',
      },
    },
    {
      description: 'LOCAL_ZONE deployment',
      deploymentMode: DeploymentMode.LOCAL_ZONE,
      planCodeHour: 'floatingip.floatingip.hour.consumption',
      planCodeMonth: 'floatingip.floatingip.month.consumption',
      expectedPrice: {
        hour: 0.5,
        month: 5,
        hourFormatted: '0.5 €/hour',
        monthFormatted: '5 €/month',
      },
    },
  ])(
    'should return formatted prices for $description',
    ({ deploymentMode, planCodeHour, planCodeMonth, expectedPrice }) => {
      vi.mocked(useCatalog).mockReturnValue({
        data: mockCatalog,
        isPending: false,
      } as ReturnType<typeof useCatalog>);

      vi.mocked(getPlanCodeFloatingIps).mockImplementation((time) => {
        if (time === 'hour') return planCodeHour;
        if (time === 'month') return planCodeMonth;
        return null;
      });

      const { result } = renderHook(() => useFloatingIpsPrice(true, deploymentMode));

      expect(result.current).toEqual({
        isPending: false,
        price: expectedPrice,
      });

      expect(mockGetFormattedHourlyCatalogPrice).toHaveBeenCalledWith(expectedPrice.hour);
      expect(mockGetFormattedMonthlyCatalogPrice).toHaveBeenCalledWith(expectedPrice.month);
    },
  );

  it('should handle null deploymentMode', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockReturnValue(null);

    const { result } = renderHook(() => useFloatingIpsPrice(true, null));

    expect(result.current).toEqual({
      isPending: false,
      price: null,
    });

    expect(getPlanCodeFloatingIps).toHaveBeenCalledWith('hour', null);
    expect(getPlanCodeFloatingIps).toHaveBeenCalledWith('month', null);
  });

  it('should handle price of 0', () => {
    const catalogWithZeroPrice = {
      addons: [
        {
          planCode: 'floatingip.floatingip.hour.consumption',
          pricings: [{ price: 0 }],
        },
        {
          planCode: 'floatingip.floatingip.month.consumption',
          pricings: [{ price: 0 }],
        },
      ],
    };

    vi.mocked(useCatalog).mockReturnValue({
      data: catalogWithZeroPrice,
      isPending: false,
    } as unknown as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockImplementation((time) => {
      if (time === 'hour') return 'floatingip.floatingip.hour.consumption';
      if (time === 'month') return 'floatingip.floatingip.month.consumption';
      return null;
    });

    const { result } = renderHook(() => useFloatingIpsPrice(true, DeploymentMode.MONO_ZONE));

    expect(result.current).toEqual({
      isPending: false,
      price: {
        hour: 0,
        month: 0,
        hourFormatted: '0 €/hour',
        monthFormatted: '0 €/month',
      },
    });
  });

  it('should use useCatalogPrice with precision of 5', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as unknown as ReturnType<typeof useCatalog>);

    renderHook(() => useFloatingIpsPrice(true, DeploymentMode.MONO_ZONE));

    expect(useCatalogPrice).toHaveBeenCalledWith(5);
  });

  it('should return price from correct addon based on plan code', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as unknown as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockImplementation((time) => {
      if (time === 'hour') return 'floatingip.floatingip.hour.consumption.3AZ';
      return null;
    });

    const { result } = renderHook(() => useFloatingIpsPrice(true, DeploymentMode.MULTI_ZONES));

    expect(result.current.price?.hour).toBe(1.5);
  });

  it('should return null when catalog is undefined', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: undefined,
      isPending: false,
    } as ReturnType<typeof useCatalog>);

    vi.mocked(getPlanCodeFloatingIps).mockReturnValue('floatingip.floatingip.hour.consumption');

    const { result } = renderHook(() => useFloatingIpsPrice(true, DeploymentMode.MONO_ZONE));

    expect(result.current).toEqual({
      isPending: false,
      price: null,
    });
  });
});
