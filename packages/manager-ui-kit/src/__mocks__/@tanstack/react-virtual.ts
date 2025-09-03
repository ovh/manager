import { vi } from 'vitest';

export const useVirtualizer = vi.fn((options) => {
  const { count, estimateSize } = options;
  const virtualItems = Array.from({ length: count }, (_, index) => ({
    index,
    start: index * (estimateSize?.() || 50),
    size: estimateSize?.() || 50,
    end: (index + 1) * (estimateSize?.() || 50),
    key: index,
  }));

  return {
    getVirtualItems: () => virtualItems,
    getTotalSize: () => count * (estimateSize?.() || 50),
    scrollToIndex: vi.fn(),
    measure: vi.fn(),
  };
});
