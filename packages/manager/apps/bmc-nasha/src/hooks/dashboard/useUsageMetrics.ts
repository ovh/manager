import { useMemo } from 'react';

import { NASHA_USE_SIZE_NAME } from '@/constants/Nasha.constants';

type Usage = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

/**
 * Hook to calculate usage metrics for the dashboard
 * Returns space left display and usage percentage
 */
export function useUsageMetrics(usage?: Usage) {
  // Calculate space left display (like the original filter)
  // The original uses usage.used, not totalUsed
  const spaceLeftDisplay = useMemo(() => {
    if (!usage || !usage[NASHA_USE_SIZE_NAME] || !usage.used) return null;
    const size = usage[NASHA_USE_SIZE_NAME];
    const used = usage.used;
    const maxSize = size.value;
    const usedValue = used.value;
    const ratio = maxSize > 0 ? ((usedValue / maxSize) * 100).toFixed(2) : '0.00';

    return {
      used: { value: usedValue, unit: used.unit },
      total: { value: maxSize, unit: size.unit },
      ratio: parseFloat(ratio),
    };
  }, [usage]);

  // Calculate usage percentage for Meter (using totalUsed for the meter)
  const usagePercentage = useMemo(() => {
    if (!usage) return 0;
    const size = usage[NASHA_USE_SIZE_NAME];
    if (!size) return 0;

    const maxSize = size.value;
    const totalUsed = Object.entries(usage)
      .filter(([key]) => key !== NASHA_USE_SIZE_NAME)
      .reduce((sum, [, data]) => sum + (data.value || 0), 0);

    return maxSize > 0 ? Math.round((totalUsed / maxSize) * 100) : 0;
  }, [usage]);

  return { spaceLeftDisplay, usagePercentage };
}
