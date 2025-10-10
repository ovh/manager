import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useDashboardItemsFilteredByFA } from './useDashboardItemsFilteredByFA';
import {
  DashboardItem,
  DashboardItemConfig,
} from '@/data/types/dashboard.type';

// Mock the external hook
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

const mockUseFeatureAvailability = vi.mocked(useFeatureAvailability);

describe('useDashboardItemsFilteredByFA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems: DashboardItem[] = [
    {
      labelTranslationKey: 'item1',
      featureFlag: 'feature1',
    },
    {
      labelTranslationKey: 'item2',
      featureFlag: 'feature2',
    },
    {
      labelTranslationKey: 'item3',
      // No feature flag
    },
  ];

  const mockConfigItems: DashboardItemConfig[] = [
    {
      labelTranslationKey: 'config1',
      featureFlag: 'feature1',
      documentationGuideKey: 'guide1',
    },
    {
      labelTranslationKey: 'config2',
      featureFlag: 'feature2',
      documentationGuideKey: 'guide2',
    },
  ];

  it('should return all items when no feature flags are present', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: undefined,
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const itemsWithoutFlags: DashboardItem[] = [
      { labelTranslationKey: 'item1' },
      { labelTranslationKey: 'item2' },
    ];

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(itemsWithoutFlags),
    );

    expect(result.current).toEqual(itemsWithoutFlags);
    expect(mockUseFeatureAvailability).toHaveBeenCalledWith([], {
      enabled: false,
    });
  });

  it('should return all items when all features are available', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        feature1: true,
        feature2: true,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(mockItems),
    );

    expect(result.current).toEqual(mockItems);
    expect(mockUseFeatureAvailability).toHaveBeenCalledWith(
      ['feature1', 'feature2'],
      { enabled: true },
    );
  });

  it('should filter out items with unavailable features', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        feature1: true,
        feature2: false,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(mockItems),
    );

    expect(result.current).toEqual([
      {
        labelTranslationKey: 'item1',
        featureFlag: 'feature1',
      },
      {
        labelTranslationKey: 'item3',
        // No feature flag
      },
    ]);
  });

  it('should return only items without feature flags when no features are available', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        feature1: false,
        feature2: false,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(mockItems),
    );

    expect(result.current).toEqual([
      {
        labelTranslationKey: 'item3',
        // No feature flag
      },
    ]);
  });

  it('should handle undefined availability data', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: undefined,
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(mockItems),
    );

    expect(result.current).toEqual([
      {
        labelTranslationKey: 'item3',
        // No feature flag
      },
    ]);
  });

  it('should work with DashboardItemConfig items', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        feature1: true,
        feature2: false,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(mockConfigItems),
    );

    expect(result.current).toEqual([
      {
        labelTranslationKey: 'config1',
        featureFlag: 'feature1',
        documentationGuideKey: 'guide1',
      },
    ]);
  });

  it('should handle empty items array', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {},
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() => useDashboardItemsFilteredByFA([]));

    expect(result.current).toEqual([]);
    expect(mockUseFeatureAvailability).toHaveBeenCalledWith([], {
      enabled: false,
    });
  });

  it('should handle items with empty feature flags', () => {
    const itemsWithEmptyFlags: DashboardItem[] = [
      {
        labelTranslationKey: 'item1',
        featureFlag: '',
      },
      {
        labelTranslationKey: 'item2',
        featureFlag: undefined,
      },
    ];

    mockUseFeatureAvailability.mockReturnValue(({
      data: {},
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useDashboardItemsFilteredByFA(itemsWithEmptyFlags),
    );

    expect(result.current).toEqual(itemsWithEmptyFlags);
    expect(mockUseFeatureAvailability).toHaveBeenCalledWith([], {
      enabled: false,
    });
  });
});
