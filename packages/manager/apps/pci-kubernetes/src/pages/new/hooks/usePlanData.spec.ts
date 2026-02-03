import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCatalog } from '@ovh-ux/manager-pci-common';

import { TClusterPlanEnum } from '@/types';

import usePlanData from './usePlanData';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useCatalog: vi.fn(),
}));

const mockUseCatalog = vi.mocked(useCatalog);

describe('usePlanData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it.each([
      { isPending: true, expected: true },
      { isPending: false, expected: false },
    ])(
      'should return isPending $expected when catalog isPending is $isPending',
      ({ isPending, expected }) => {
        mockUseCatalog.mockReturnValue({
          data: isPending ? undefined : { addons: [] },
          isPending,
        } as ReturnType<typeof useCatalog>);

        const { result } = renderHook(() => usePlanData([]));

        expect(result.current.isPending).toBe(expected);
      },
    );
  });

  describe('plans structure', () => {
    beforeEach(() => {
      mockUseCatalog.mockReturnValue({
        data: { addons: [] },
        isPending: false,
      } as unknown as ReturnType<typeof useCatalog>);
    });

    it('should return two plans (FREE and STANDARD)', () => {
      const { result } = renderHook(() => usePlanData([]));

      expect(result.current.plans).toHaveLength(2);
      expect(result.current.plans[0]?.value).toBe(TClusterPlanEnum.FREE);
      expect(result.current.plans[1]?.value).toBe(TClusterPlanEnum.STANDARD);
    });

    it.each([
      {
        planIndex: 0,
        planName: 'FREE',
        expectedTitle: 'kube_add_plan_title_free',
        expectedDescription: 'kube_add_plan_description_free',
        expectedContent: [
          'kube_add_plan_content_free_control',
          'kube_add_plan_content_free_high_availability',
          'kube_add_plan_content_free_SLO',
          'kube_add_plan_content_free_auto_scaling',
          'kube_add_plan_content_free_ETCD',
          'kube_add_plan_content_free_version',
          'kube_add_plan_content_free_100',
        ],
      },
      {
        planIndex: 1,
        planName: 'STANDARD',
        expectedTitle: 'kube_add_plan_title_standard',
        expectedDescription: 'kube_add_plan_description_standard',
        expectedContent: [
          'kube_add_plan_content_standard_1AZ_control_plane',
          'kube_add_plan_content_standard_1AZ_SLA',
          'kube_add_plan_content_free_auto_scaling',
          'kube_add_plan_content_standard_ETCD',
          'kube_add_plan_content_standard_version',
          'kube_add_plan_content_standard_500',
        ],
      },
    ])(
      'should have correct translation keys for $planName plan',
      ({ planIndex, expectedTitle, expectedDescription, expectedContent }) => {
        const { result } = renderHook(() => usePlanData([]));

        const plan = result.current.plans[planIndex];
        expect(plan?.title).toBe(expectedTitle);
        expect(plan?.description).toBe(expectedDescription);
        expectedContent.forEach((content) => {
          expect(plan?.content).toContain(content);
        });
      },
    );
  });

  describe('code matching', () => {
    beforeEach(() => {
      mockUseCatalog.mockReturnValue({
        data: { addons: [] },
        isPending: false,
      } as unknown as ReturnType<typeof useCatalog>);
    });

    it.each([
      {
        scenario: 'single zone codes',
        codes: ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
        isMultiZone: false,
        expectedFreeCode: 'mks.free.hour.consumption',
        expectedStandardCode: 'mks.standard.hour.consumption',
      },
      {
        scenario: '3AZ codes with multiZone enabled',
        codes: ['mks.free.hour.consumption.3az', 'mks.standard.hour.consumption.3az'],
        isMultiZone: true,
        expectedFreeCode: 'mks.free.hour.consumption.3az',
        expectedStandardCode: 'mks.standard.hour.consumption.3az',
      },
      {
        scenario: 'empty codes array',
        codes: [],
        isMultiZone: false,
        expectedFreeCode: null,
        expectedStandardCode: null,
      },
    ])(
      'should match codes correctly for $scenario',
      ({ codes, isMultiZone, expectedFreeCode, expectedStandardCode }) => {
        const { result } = renderHook(() => usePlanData(codes, isMultiZone));

        expect(result.current.plans[0]?.code).toBe(expectedFreeCode);
        expect(result.current.plans[1]?.code).toBe(expectedStandardCode);
      },
    );
  });

  describe('pricing', () => {
    it.each([
      {
        scenario: 'returns price from catalog addon',
        catalogData: {
          addons: [
            { planCode: 'mks.free.hour.consumption', pricings: [{ price: 0 }] },
            { planCode: 'mks.standard.hour.consumption', pricings: [{ price: 1500000 }] },
          ],
        },
        codes: ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
        expectedFreePrice: 0,
        expectedStandardPrice: 1500000,
      },
      {
        scenario: 'returns null when addon not found in catalog',
        catalogData: { addons: [] },
        codes: ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
        expectedFreePrice: null,
        expectedStandardPrice: null,
      },

      {
        scenario: 'returns null when pricings array is empty',
        catalogData: {
          addons: [
            { planCode: 'mks.free.hour.consumption', pricings: [] },
            { planCode: 'mks.standard.hour.consumption', pricings: [] },
          ],
        },
        codes: ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
        expectedFreePrice: null,
        expectedStandardPrice: null,
      },
    ])('$scenario', ({ catalogData, codes, expectedFreePrice, expectedStandardPrice }) => {
      mockUseCatalog.mockReturnValue({
        data: catalogData,
        isPending: !catalogData,
      } as ReturnType<typeof useCatalog>);

      const { result } = renderHook(() => usePlanData(codes));

      expect(result.current.plans[0]?.price).toBe(expectedFreePrice);
      expect(result.current.plans[1]?.price).toBe(expectedStandardPrice);
    });
  });

  describe('multiZone content', () => {
    beforeEach(() => {
      mockUseCatalog.mockReturnValue({
        data: { addons: [] },
        isPending: false,
      } as unknown as ReturnType<typeof useCatalog>);
    });

    it.each([
      {
        isMultiZone: false,
        expectedControlPlane: 'kube_add_plan_content_standard_1AZ_control_plane',
        unexpectedControlPlane: 'kube_add_plan_content_standard_3AZ_control_plane',
        hasDisponibility: false,
      },
      {
        isMultiZone: true,
        expectedControlPlane: 'kube_add_plan_content_standard_3AZ_control_plane',
        unexpectedControlPlane: 'kube_add_plan_content_standard_1AZ_control_plane',
        hasDisponibility: true,
      },
    ])(
      'should use correct AZ content when isMultiZone is $isMultiZone',
      ({ isMultiZone, expectedControlPlane, unexpectedControlPlane, hasDisponibility }) => {
        const { result } = renderHook(() => usePlanData([], isMultiZone));

        const standardPlan = result.current.plans[1];
        expect(standardPlan?.content).toContain(expectedControlPlane);
        expect(standardPlan?.content).not.toContain(unexpectedControlPlane);

        if (hasDisponibility) {
          expect(standardPlan?.content).toContain('kube_add_plan_content_standard_disponibility');
        } else {
          expect(standardPlan?.content).not.toContain(
            'kube_add_plan_content_standard_disponibility',
          );
        }
      },
    );

    it('should default isMultiZone to false when not provided', () => {
      const { result } = renderHook(() => usePlanData([]));

      const standardPlan = result.current.plans[1];
      expect(standardPlan?.content).toContain('kube_add_plan_content_standard_1AZ_control_plane');
    });
  });
});
