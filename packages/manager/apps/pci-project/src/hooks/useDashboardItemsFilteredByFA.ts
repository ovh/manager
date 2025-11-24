import { useMemo } from 'react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import {
  DashboardItem,
  DashboardItemConfig,
} from '@/data/types/dashboard.type';

/**
 * Hook to filter dashboard items based on feature flag availability
 * @param items - Array of dashboard items to filter
 * @returns Filtered array of dashboard items
 */
export const useDashboardItemsFilteredByFA = <
  T extends DashboardItem | DashboardItemConfig
>(
  items: T[],
): T[] => {
  // Extract all feature flags from items
  const featureFlags = useMemo(
    () => items.map((item) => item.featureFlag).filter(Boolean) as string[],
    [items],
  );

  // Check feature availability for all flags
  const { data: availability } = useFeatureAvailability(featureFlags, {
    enabled: featureFlags.length > 0,
  });

  // Filter items based on feature availability
  return useMemo(() => {
    return items.filter((item) => {
      // If no feature flag is specified, always show the item
      if (!item.featureFlag) {
        return true;
      }

      // Show item only if feature flag is available
      return availability?.[item.featureFlag] || false;
    });
  }, [items, availability]);
};

export default useDashboardItemsFilteredByFA;
